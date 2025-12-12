from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, IngredientViewSet, CategoryViewSet, RecipeIngredientViewSet, DirectionViewSet

router = DefaultRouter()
router.register('recipes', RecipeViewSet)
router.register('ingredients', IngredientViewSet)
router.register('categories', CategoryViewSet)
router.register('recipe-ingredients', RecipeIngredientViewSet)
router.register('directions', DirectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
