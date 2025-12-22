from django.contrib import admin
from .models import (
    Category,
    Ingredient,
    Recipe,
    RecipeIngredient,
    Direction,
    Favorite, 
    Cuisine,
)

admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(Direction)
admin.site.register(Favorite)
admin.site.register(Cuisine)
