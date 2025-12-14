from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .models import (
    Recipe,
    Ingredient,
    Category,
    RecipeIngredient,
    Direction,
    Favorite
)

from .serializers import (
    RecipeSerializer,
    IngredientSerializer,
    CategorySerializer,
    RecipeIngredientSerializer,
    DirectionSerializer
)


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category__name']
    search_fields = ['name', 'recipe_ingredients__ingredient__name']

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RecipeIngredientViewSet(viewsets.ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer

class DirectionViewSet(viewsets.ModelViewSet):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer

class AddToFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        recipe = Recipe.objects.get(id=recipe_id)

        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            recipe=recipe
        )

        if not created:
            return Response(
                {"detail": "already in favorites"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "added to favorites"},
            status=status.HTTP_201_CREATED
        )


class RemoveFromFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, recipe_id):
        Favorite.objects.filter(
            user=request.user,
            recipe_id=recipe_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer

    def get_queryset(self):
        return Recipe.objects.filter(
            favorited_by__user=self.request.user
        )
