from django.contrib import admin
from .models import Recipe


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['title', 'source', 'recipe_id', 'created_at']
    list_filter = ['source', 'created_at']
    search_fields = ['title', 'recipe_id', 'ingredients', 'instructions']
    readonly_fields = ['recipe_id', 'created_at', 'updated_at']
    fields = ['recipe_id', 'title', 'ingredients', 'instructions', 'picture_link', 'source', 'created_at', 'updated_at']
