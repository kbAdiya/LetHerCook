from rest_framework import serializers
from .models import Recipe, Ingredient, Category, RecipeIngredient, Direction

def get_lang(request):
    if not request:
        return 'en'
    return request.query_params.get('lang', 'en')

# --- Category ---
class CategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name']

    def get_name(self, obj):
        lang = get_lang(self.context.get('request'))
        return getattr(obj, f'name_{lang}', obj.name_en)

# --- Ingredient ---
class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'is_meat']

    def get_name(self, obj):
        lang = get_lang(self.context.get('request'))
        return getattr(obj, f'name_{lang}', obj.name_en)

    def validate(self, attrs):
        """
        Сохраняем твою логику:
        - нормализация имени
        - проверка уникальности без учета регистра
        Но теперь делаем это корректно для мультиязычной модели
        """
        request = self.context.get('request')

        # проверка нужна только при создании ингредиента
        if request and request.method == 'POST':
            name_en = request.data.get('name_en')

            if not name_en:
                raise serializers.ValidationError({
                    'name_en': 'This field is required.'
                })

            normalized = name_en.strip().capitalize()

            if Ingredient.objects.filter(name_en__iexact=normalized).exists():
                raise serializers.ValidationError(
                    "Ингредиент с таким именем уже существует"
                )

            # подменяем на нормализованное значение
            attrs['name_en'] = normalized

        return attrs

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
    instruction = serializers.SerializerMethodField()

    class Meta:
        model = Direction
        fields = ['instruction']

    def get_instruction(self, obj):
        lang = get_lang(self.context.get('request'))
        return getattr(obj, f'instruction_{lang}', obj.instruction_en)


# --- Recipe ---
class RecipeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    direction = serializers.SerializerMethodField()
    ingredients = RecipeIngredientSerializer(
        source='recipe_ingredients',  # related_name из модели RecipeIngredient
        many=True,
        read_only=True

    )

    class Meta:
        model = Recipe
        fields = [
            'id',
            'name',
            'category',
            'category_id',
            'photo',
            'description',
            'direction',
            'is_vegan',
            'ingredients'
        ]

    def get_name(self, obj):
        lang = get_lang(self.context.get('request'))
        return getattr(obj, f'name_{lang}', obj.name_en)

    def get_description(self, obj):
        lang = get_lang(self.context.get('request'))
        return getattr(obj, f'description_{lang}', obj.description_en)
    
    def get_direction(self, obj):
        if not hasattr(obj, 'direction'):
            return None

        serializer = DirectionSerializer(
            obj.direction,
            context=self.context
        )
        return serializer.data

    def create(self, validated_data):
        direction_data = validated_data.pop("direction", None)

        # создаём рецепт
        recipe = Recipe.objects.create(**validated_data)

        # создаём инструкцию
        if direction_data:
            Direction.objects.create(recipe=recipe, **direction_data)

        return recipe
    
    

