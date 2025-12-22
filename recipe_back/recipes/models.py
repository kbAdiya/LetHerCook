from django.db import models
from django.conf import settings

# ======================
# CATEGORY
# ======================
class Category(models.Model):
    name_en = models.CharField(max_length=100)
    name_ru = models.CharField(max_length=100)
    name_kz = models.CharField(max_length=100)

    def __str__(self):
        return self.name_en

# ======================
# INGREDIENT
# ======================
class Ingredient(models.Model):
    name_en = models.CharField(max_length=100, unique=True)
    name_ru = models.CharField(max_length=100)
    name_kz = models.CharField(max_length=100)
    is_meat = models.BooleanField(default=False)

    def __str__(self):
        return self.name_en

# ======================
# RECIPE
# ======================
class Recipe(models.Model):
    name_en = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200)
    name_kz = models.CharField(max_length=200)

    description_en = models.TextField(null=True, blank=True)
    description_ru = models.TextField(null=True, blank=True)
    description_kz = models.TextField(null=True, blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True
    )
    photo = models.URLField(max_length=500, null=True, blank=True)  # ссылка на картинку

    is_vegan = models.BooleanField(default=True)

    cuisine = models.ForeignKey(
        "Cuisine",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )

    def __str__(self):
        return self.name_en

    def _compute_is_vegan(self):
        """True when recipe has no meat ingredients."""
        return not self.recipe_ingredients.filter(
            ingredient__is_meat=True
            ).exists()

    def refresh_is_vegan(self):
        """
        Recalculate and persist the vegan flag.
        We use update() to avoid recursive save calls.
        """
        new_value = self._compute_is_vegan()
        self.is_vegan = new_value
        if self.pk:
            Recipe.objects.filter(pk=self.pk).update(is_vegan=new_value)
        return new_value

    def save(self, *args, **kwargs):
        # Save first (so we have a PK), then refresh the flag based on ingredients.
        super().save(*args, **kwargs)
        self.refresh_is_vegan()


# ======================
# RECIPE INGREDIENT (M2M)
# ======================
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='recipe_ingredients'
    )

    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='ingredient_recipes'
    )

    quantity = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    class Meta:
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return f"{self.recipe.name_en} - {self.ingredient.name_en} ({self.quantity})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.recipe.refresh_is_vegan()

    def delete(self, *args, **kwargs):
        recipe = self.recipe
        super().delete(*args, **kwargs)
        recipe.refresh_is_vegan()


# ======================
# DIRECTION
# ======================
class Direction(models.Model):
    recipe = models.OneToOneField(
        Recipe,
        on_delete=models.CASCADE,
        related_name='direction'
    )

    instruction_en = models.TextField()
    instruction_ru = models.TextField()
    instruction_kz = models.TextField()

    def __str__(self):
        return f"{self.recipe.name_en} - instruction"


# ======================
# FAVORITE
# ======================
class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f"{self.user} ❤️ {self.recipe.name_en}"


class Cuisine(models.Model):
    name_en = models.CharField(max_length=100, unique=True)
    name_ru = models.CharField(max_length=100, unique=True)
    name_kz = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name_en

