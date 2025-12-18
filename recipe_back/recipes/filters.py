from django_filters import rest_framework as filters
from .models import Recipe
from django.db.models import Q

class RecipeFilter(filters.FilterSet):
    ingredients = filters.CharFilter(method='filter_ingredients')
    category = filters.CharFilter(method='filter_category')
    is_vegan = filters.BooleanFilter()

    class Meta:
        model = Recipe
        fields = ['category', 'is_vegan', 'ingredients']

    def filter_category(self, queryset, name, value):
        return queryset.filter(
            Q(category__name_en__iexact=value) |
            Q(category__name_ru__iexact=value) |
            Q(category__name_kz__iexact=value)
        ).distinct()

    def filter_ingredients(self, queryset, name, value):
        # value = "pepper,onion"
        names = [v.strip() for v in value.split(',') if v.strip()]

        for n in names:
            queryset = queryset.filter(
                Q(recipe_ingredients__ingredient__name_en__icontains=n) |
                Q(recipe_ingredients__ingredient__name_ru__icontains=n) |
                Q(recipe_ingredients__ingredient__name_kz__icontains=n)
            )
        
        return queryset.distinct()
