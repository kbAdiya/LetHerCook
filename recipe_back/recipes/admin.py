from django.contrib import admin
from .models import Recipe, Ingredient, RecipeIngredient, Direction


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipe_name', 'category', 'cuisine_path', 'prep_time', 'cook_time', 'total_time']
    list_filter = ['category', 'cuisine_path']
    search_fields = ['recipe_name', 'category', 'cuisine_path']
    readonly_fields = ['id']
    fields = ['id', 'recipe_name', 'prep_time', 'cook_time', 'total_time', 'servings', 'rating', 'url', 'cuisine_path', 'category']


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    readonly_fields = ['id']


@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipe', 'ingredient', 'raw_text']
    list_filter = ['recipe', 'ingredient']
    search_fields = ['raw_text', 'ingredient__name', 'recipe__recipe_name']
    readonly_fields = ['id']


@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipe', 'step_number', 'instruction']
    list_filter = ['recipe']
    search_fields = ['instruction', 'recipe__recipe_name']
    readonly_fields = ['id']
    ordering = ['recipe', 'step_number']
