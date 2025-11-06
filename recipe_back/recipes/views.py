from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Recipe
from .serializers import RecipeSerializer


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing recipes.
    Provides list, detail, search, and filter functionality.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'ingredients', 'instructions']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Recipe.objects.all()
        source = self.request.query_params.get('source', None)
        if source:
            queryset = queryset.filter(source=source)
        return queryset

    @action(detail=False, methods=['get'])
    def random(self, request):
        """Get a random recipe"""
        import random
        count = Recipe.objects.count()
        if count == 0:
            return Response({'error': 'No recipes available'}, status=404)
        random_index = random.randint(0, count - 1)
        recipe = Recipe.objects.all()[random_index]
        serializer = self.get_serializer(recipe)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get total count of recipes"""
        total = Recipe.objects.count()
        by_source = {}
        for source_code, source_name in Recipe._meta.get_field('source').choices:
            by_source[source_code] = Recipe.objects.filter(source=source_code).count()
        return Response({
            'total': total,
            'by_source': by_source
        })
