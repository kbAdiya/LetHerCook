from django.db import models

from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_meat = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    photo = models.URLField(max_length=500, null=True, blank=True)  # ссылка на картинку
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def is_vegan(self):
       
        return not self.recipe_ingredients.filter(ingredient__is_meat=True).exists()

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='recipe_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='ingredient_recipes')
    quantity = models.CharField(max_length=100, null=True, blank=True)  # например, "2 столовые ложки", "500 г"

    class Meta:
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return f"{self.recipe.name} - {self.ingredient.name} ({self.quantity})"

class Direction(models.Model):
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE, related_name='direction')
    instruction = models.TextField()

    def __str__(self):
        return f"{self.recipe.name} - instruction"

