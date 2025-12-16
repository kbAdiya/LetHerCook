from django_filters import rest_framework as filters
from .models import Recipe

class RecipeFilter(filters.FilterSet):
    ingredients = filters.CharFilter(method='filter_ingredients')

    class Meta:
        model = Recipe
        fields = ['category__name', 'is_vegan', 'ingredients']

    def filter_ingredients(self, queryset, name, value):
        # value = "pepper,onion"
        names = [v.strip() for v in value.split(',') if v.strip()]
        for n in names:
            queryset = queryset.filter(recipe_ingredients__ingredient__name__icontains=n)
        return queryset.distinct()
