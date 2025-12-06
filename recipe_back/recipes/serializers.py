from rest_framework import serializers
import re
from .models import Recipe, Ingredient, RecipeIngredient, Direction, Favorite


class RecipeListSerializer(serializers.ModelSerializer):
    """Serializer for recipe list view - minimal fields"""
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ['id', 'recipe_name', 'category', 'cuisine_path', 'is_favorited']
        read_only_fields = ['id', 'is_favorited']
    
    def get_is_favorited(self, obj):
        """Check if recipe is favorited by current user"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, recipe_id=obj.id).exists()
        return False


class IngredientSerializer(serializers.ModelSerializer):
    """Serializer for ingredients in recipe detail"""
    class Meta:
        model = Ingredient
        fields = ['id', 'name']
        read_only_fields = ['id']


class RecipeIngredientSerializer(serializers.ModelSerializer):
    """Serializer for recipe ingredients with raw text"""
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    
    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient_name', 'raw_text']
        read_only_fields = ['id']


class DirectionSerializer(serializers.ModelSerializer):
    """Serializer for recipe directions/steps"""
    class Meta:
        model = Direction
        fields = ['id', 'step_number', 'instruction']
        read_only_fields = ['id']


class RecipeDetailSerializer(serializers.ModelSerializer):
    """Serializer for full recipe detail view"""
    ingredients = serializers.SerializerMethodField()
    directions = serializers.SerializerMethodField()
    minutes = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'recipe_name', 'ingredients', 'directions', 
            'prep_time', 'cook_time', 'total_time', 'minutes',
            'cuisine_path', 'category', 'servings', 'rating', 'url',
            'is_favorited'
        ]
        read_only_fields = ['id', 'is_favorited']
    
    def get_ingredients(self, obj):
        """Get all ingredients for this recipe"""
        recipe_ingredients = RecipeIngredient.objects.using('recipes_db').filter(recipe=obj).select_related('ingredient')
        return [
            {
                'name': ri.ingredient.name,
                'raw_text': ri.raw_text
            }
            for ri in recipe_ingredients
        ]
    
    def get_directions(self, obj):
        """Get all directions/steps for this recipe, ordered by step_number"""
        directions = Direction.objects.using('recipes_db').filter(recipe=obj).order_by('step_number')
        return DirectionSerializer(directions, many=True).data
    
    def parse_time_to_minutes(self, time_str):
        """Parse time string like '30 mins' or '1 hour 30 mins' to minutes"""
        if not time_str:
            return None
        try:
            # Try to parse as integer first (if it's already a number)
            if isinstance(time_str, (int, float)):
                return int(time_str)
            # If it's a string, try to extract numbers
            # Remove common words and extract numbers
            time_str = str(time_str).lower().strip()
            # Extract hours and minutes
            hours = 0
            minutes = 0
            hour_match = re.search(r'(\d+)\s*h(?:our|r)?', time_str)
            if hour_match:
                hours = int(hour_match.group(1))
            min_match = re.search(r'(\d+)\s*m(?:in|inute)?', time_str)
            if min_match:
                minutes = int(min_match.group(1))
            # If no pattern matched, try to extract first number
            if hours == 0 and minutes == 0:
                num_match = re.search(r'(\d+)', time_str)
                if num_match:
                    minutes = int(num_match.group(1))
            return hours * 60 + minutes if (hours > 0 or minutes > 0) else None
        except:
            return None
    
    def get_minutes(self, obj):
        """Return total_time in minutes if available, otherwise calculate from prep_time and cook_time"""
        if obj.total_time:
            parsed = self.parse_time_to_minutes(obj.total_time)
            if parsed:
                return parsed
        # Try to sum prep_time and cook_time
        prep_minutes = self.parse_time_to_minutes(obj.prep_time) if obj.prep_time else 0
        cook_minutes = self.parse_time_to_minutes(obj.cook_time) if obj.cook_time else 0
        if prep_minutes or cook_minutes:
            return (prep_minutes or 0) + (cook_minutes or 0)
        return None
    
    def get_is_favorited(self, obj):
        """Check if recipe is favorited by current user"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, recipe_id=obj.id).exists()
        return False
