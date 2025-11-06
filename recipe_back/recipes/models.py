from django.db import models
import json


class Recipe(models.Model):
    """Recipe model to store recipe data from JSON files"""
    recipe_id = models.CharField(max_length=255, unique=True, db_index=True)
    title = models.CharField(max_length=500)
    ingredients = models.JSONField(default=list, help_text="List of ingredients")
    instructions = models.TextField()
    picture_link = models.CharField(max_length=500, null=True, blank=True)
    source = models.CharField(max_length=10, choices=[
        ('ar', 'All Recipes'),
        ('epi', 'Epicurious'),
        ('fn', 'Food Network'),
    ], db_index=True, help_text="Source of the recipe")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipe_id']),
            models.Index(fields=['source']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title
