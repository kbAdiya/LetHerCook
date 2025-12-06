from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone
from pathlib import Path
from .models import Recipe, Ingredient, RecipeIngredient, Direction, Favorite
from .serializers import RecipeListSerializer, RecipeDetailSerializer


@api_view(['GET'])
def categories_list(request):
    """GET /api/categories - Get distinct categories"""
    try:
        categories = Recipe.objects.using('recipes_db').exclude(
            category__isnull=True
        ).exclude(
            category__exact=''
        ).values_list('category', flat=True).distinct().order_by('category')
        
        return Response(list(categories))
    except Exception as e:
        return Response({
            'error': f'Database connection error: {str(e)}. Please check if recipes.db exists and the path in settings.py is correct.'
        }, status=500)


@api_view(['GET'])
def test_db_connection(request):
    """Test endpoint to check database connection and count recipes"""
    try:
        count = Recipe.objects.using('recipes_db').count()
        from django.conf import settings
        db_path = settings.DATABASES['recipes_db']['NAME']
        return Response({
            'success': True,
            'recipe_count': count,
            'database_path': str(db_path),
            'database_exists': Path(db_path).exists() if hasattr(Path, 'exists') else 'unknown'
        })
    except Exception as e:
        from django.conf import settings
        db_path = settings.DATABASES['recipes_db']['NAME']
        return Response({
            'success': False,
            'error': str(e),
            'database_path': str(db_path),
            'database_exists': Path(db_path).exists() if hasattr(Path, 'exists') else 'unknown'
        }, status=500)


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'ok',
        'message': 'API is running',
        'timestamp': str(timezone.now())
    })


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing recipes from recipes_db.
    All queries use Recipe.objects.using("recipes_db")
    """
    serializer_class = RecipeListSerializer

    def get_queryset(self):
        """Get queryset using recipes_db"""
        queryset = Recipe.objects.using('recipes_db').all()
        
        # Search by recipe_name (case-insensitive)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(recipe_name__icontains=search)
        
        # Filter by cuisine_path if provided
        cuisine = self.request.query_params.get('cuisine', None)
        if cuisine:
            queryset = queryset.filter(cuisine_path__icontains=cuisine)
        
        return queryset

    def get_object(self):
        """Override to use recipes_db"""
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = queryset.get(**filter_kwargs)
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def list(self, request, *args, **kwargs):
        """GET /api/recipes?limit=50&offset=0&search=text&cuisine=Italian"""
        try:
            queryset = self.get_queryset()
            total = queryset.count()
        except Exception as e:
            return Response({
                'error': f'Database connection error: {str(e)}. Please check if recipes.db exists at the configured path.',
                'count': 0,
                'results': []
            }, status=500)
        
        # Pagination - allow higher limits, default to 50 for performance
        # User can specify limit=0 or limit=-1 to get all (not recommended for large datasets)
        limit_param = request.query_params.get('limit', '50')
        if limit_param in ['0', '-1', 'all']:
            # Return all recipes (use with caution for 232k recipes!)
            limit = None
            offset = 0
            queryset = queryset
        else:
            try:
                limit = int(limit_param)
                # Cap at 10000 for safety
                if limit > 10000:
                    limit = 10000
            except ValueError:
                limit = 50
            offset = int(request.query_params.get('offset', 0))
            queryset = queryset[offset:offset + limit]
        
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        
        response_data = {
            'count': total,
            'results': serializer.data
        }
        
        if limit is not None:
            response_data['next'] = f"?limit={limit}&offset={offset + limit}" if offset + limit < total else None
            response_data['previous'] = f"?limit={limit}&offset={max(0, offset - limit)}" if offset > 0 else None
        else:
            response_data['next'] = None
            response_data['previous'] = None
        
        return Response(response_data)
    
    def retrieve(self, request, *args, **kwargs):
        """GET /api/recipes/<id> - Full recipe detail"""
        try:
            instance = self.get_object()
            serializer = RecipeDetailSerializer(instance, context={'request': request})
            return Response(serializer.data)
        except Recipe.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=404)
        except Exception as e:
            return Response({'error': f'Error fetching recipe: {str(e)}'}, status=500)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """GET /api/categories - Get distinct categories"""
        categories = Recipe.objects.using('recipes_db').exclude(
            category__isnull=True
        ).exclude(
            category__exact=''
        ).values_list('category', flat=True).distinct().order_by('category')
        
        return Response(list(categories))
    
    @action(detail=False, methods=['get'], url_path='category/(?P<category_name>[^/]+)')
    def by_category(self, request, category_name=None):
        """GET /api/recipes/category/<category_name> - Get recipes by category"""
        queryset = Recipe.objects.using('recipes_db').filter(category=category_name)
        
        # Pagination
        limit = int(request.query_params.get('limit', 50))
        offset = int(request.query_params.get('offset', 0))
        
        total = queryset.count()
        queryset = queryset[offset:offset + limit]
        
        serializer = RecipeListSerializer(queryset, many=True, context={'request': request})
        return Response({
            'count': total,
            'category': category_name,
            'results': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def search_by_ingredients(self, request):
        """
        POST /api/recipes/search-by-ingredients
        Input: {
            "ingredients": ["chicken", "tomato"],
            "cuisine": "Italian" | null,
            "category": "Main Dish" | null,
            "vegetarian": true | false
        }
        """
        ingredients = request.data.get('ingredients', [])
        cuisine = request.data.get('cuisine', None)
        category = request.data.get('category', None)
        vegetarian = request.data.get('vegetarian', False)
        
        if not ingredients:
            return Response(
                {'error': 'ingredients list is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Start with all recipes
        queryset = Recipe.objects.using('recipes_db').all()
        
        # Filter by ingredients - recipes that contain ALL specified ingredients
        ingredient_names = [ing.lower().strip() for ing in ingredients]
        
        # Try exact match first (case-insensitive)
        ingredient_objs = Ingredient.objects.using('recipes_db').filter(
            name__in=ingredient_names
        )
        
        # If no exact matches, try case-insensitive contains for each ingredient
        if not ingredient_objs.exists():
            from django.db.models import Q
            q_objects = Q()
            for ing_name in ingredient_names:
                q_objects |= Q(name__icontains=ing_name)
            ingredient_objs = Ingredient.objects.using('recipes_db').filter(q_objects)
        
        if not ingredient_objs.exists():
            return Response({
                'count': 0, 
                'results': [],
                'message': f'No ingredients found matching: {", ".join(ingredient_names)}'
            })
        
        # Get recipe IDs that have all the specified ingredients
        recipe_ids_with_all_ingredients = RecipeIngredient.objects.using('recipes_db').filter(
            ingredient__in=ingredient_objs
        ).values('recipe_id').annotate(
            ingredient_count=Count('ingredient', distinct=True)
        ).filter(
            ingredient_count=len(ingredient_names)
        ).values_list('recipe_id', flat=True)
        
        queryset = queryset.filter(id__in=recipe_ids_with_all_ingredients)
        
        # Filter by cuisine (case-insensitive partial match)
        if cuisine:
            queryset = queryset.filter(cuisine_path__icontains=cuisine.strip())
        
        # Filter by category
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter vegetarian - exclude recipes with meat ingredients
        if vegetarian:
            meat_keywords = [
                "beef", "pork", "chicken", "turkey", "lamb", "fish", 
                "shrimp", "bacon", "sausage", "steak"
            ]
            meat_ingredients = Ingredient.objects.using('recipes_db').filter(
                name__in=meat_keywords
            )
            if meat_ingredients.exists():
                meat_recipe_ids = RecipeIngredient.objects.using('recipes_db').filter(
                    ingredient__in=meat_ingredients
                ).values_list('recipe_id', flat=True).distinct()
                queryset = queryset.exclude(id__in=meat_recipe_ids)
        
        # Pagination
        limit = int(request.query_params.get('limit', 50))
        offset = int(request.query_params.get('offset', 0))
        
        total = queryset.count()
        queryset = queryset[offset:offset + limit]
        
        serializer = RecipeListSerializer(queryset, many=True, context={'request': request})
        return Response({
            'count': total,
            'results': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like a recipe"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        recipe = self.get_object()
        # Note: Favorite uses recipe_id (integer), not ForeignKey to Recipe
        # because Recipe is in a different database
        try:
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                recipe_id=recipe.id
            )
            if created:
                return Response({'message': 'Recipe liked', 'is_favorited': True}, status=201)
            else:
                return Response({'message': 'Recipe already liked', 'is_favorited': True}, status=200)
        except Exception as e:
            return Response({'error': f'Error liking recipe: {str(e)}'}, status=500)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        """Unlike a recipe"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        recipe = self.get_object()
        try:
            favorite = Favorite.objects.filter(user=request.user, recipe_id=recipe.id).first()
            if favorite:
                favorite.delete()
                return Response({'message': 'Recipe unliked', 'is_favorited': False}, status=200)
            else:
                return Response({'message': 'Recipe not in favorites', 'is_favorited': False}, status=200)
        except Exception as e:
            return Response({'error': f'Error unliking recipe: {str(e)}'}, status=500)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        """Get all favorited recipes for the current user"""
        favorites = Favorite.objects.filter(user=request.user)
        recipe_ids = [f.recipe_id for f in favorites]
        recipes = Recipe.objects.using('recipes_db').filter(id__in=recipe_ids)
        serializer = RecipeDetailSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data)
