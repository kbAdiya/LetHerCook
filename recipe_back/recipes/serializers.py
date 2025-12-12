from rest_framework import serializers
from .models import Recipe, Ingredient, Category, RecipeIngredient, Direction

# --- Category ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# --- Ingredient ---
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'is_meat']

    def validate_name(self, value):
        # нормализуем имя
        normalized = value.strip().capitalize()

        # проверяем уникальность без учета регистра
        if Ingredient.objects.filter(name__iexact=normalized).exists():
            raise serializers.ValidationError("Ингредиент с таким именем уже существует")

        return normalized

# --- RecipeIngredient ---
class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(), source='ingredient', write_only=True
    )
    recipe = serializers.StringRelatedField(read_only=True) 
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(), source='recipe', write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'recipe', 'recipe_id', 'ingredient', 'ingredient_id', 'quantity']


# --- Direction ---
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = ['instruction']


# --- Recipe ---
class RecipeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    direction = DirectionSerializer(required=False)
    ingredients = RecipeIngredientSerializer(
        source='recipe_ingredients',  # related_name из модели RecipeIngredient
        many=True,
        read_only=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'category', 'category_id',
                  'photo', 'description', 'direction', 'is_vegan', 'ingredients']

    def create(self, validated_data):
        direction_data = validated_data.pop("direction", None)

        # создаём рецепт
        recipe = Recipe.objects.create(**validated_data)

        # создаём инструкцию
        if direction_data:
            Direction.objects.create(recipe=recipe, **direction_data)

        return recipe


