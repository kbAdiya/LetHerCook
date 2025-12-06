from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, categories_list, test_db_connection, health_check

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('health/', health_check, name='health'),
    path('categories/', categories_list, name='categories'),
    path('test-db/', test_db_connection, name='test-db'),
    path('', include(router.urls)),
]

