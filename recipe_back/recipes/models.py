from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    id = models.IntegerField(primary_key=True)
    recipe_name = models.TextField()
    prep_time = models.TextField(null=True)  # Changed to TextField to handle "30 mins" format
    cook_time = models.TextField(null=True)  # Changed to TextField to handle "30 mins" format
    total_time = models.TextField(null=True)  # Changed to TextField to handle "30 mins" format
    servings = models.IntegerField(null=True)
    rating = models.FloatField(null=True)
    url = models.TextField(null=True)
    cuisine_path = models.TextField(null=True)
    category = models.TextField(null=True)  # категория блюд
    class Meta:
        db_table = "recipes"
        app_label = "recipes"

class Ingredient(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    class Meta:
        db_table = "ingredients"
        app_label = "recipes"

class RecipeIngredient(models.Model):
    id = models.IntegerField(primary_key=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    raw_text = models.TextField()
    class Meta:
        db_table = "recipe_ingredients"
        app_label = "recipes"

class Direction(models.Model):
    id = models.IntegerField(primary_key=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    step_number = models.IntegerField()
    instruction = models.TextField()
    class Meta:
        db_table = "directions"
        app_label = "recipes"


class Favorite(models.Model):
    """Model to store user's favorite recipes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'recipe']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'recipe']),
        ]

    def __str__(self):
        return f"{self.user.username} likes {self.recipe.recipe_name}"
