from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RecipeViewSet,
    IngredientViewSet,
    CategoryViewSet,
    RecipeIngredientViewSet,
    DirectionViewSet,
    AddToFavoriteView,
    RemoveFromFavoriteView,
    FavoriteListView
)

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'recipe-ingredients', RecipeIngredientViewSet)
router.register(r'directions', DirectionViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # favorites
    path('favorites/', FavoriteListView.as_view()),
    path('recipes/<int:recipe_id>/favorite/', AddToFavoriteView.as_view()),
    path('recipes/<int:recipe_id>/favorite/remove/', RemoveFromFavoriteView.as_view()),
]
