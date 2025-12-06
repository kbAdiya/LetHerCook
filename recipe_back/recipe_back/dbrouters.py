class RecipesRouter:
    """
    Database router to route Recipe, Ingredient, RecipeIngredient, Direction models
    to recipes_db, while keeping Favorite and User models in default database.
    """
    recipes_models = {'Recipe', 'Ingredient', 'RecipeIngredient', 'Direction'}

    def db_for_read(self, model, **hints):
        if model._meta.model_name in self.recipes_models and model._meta.app_label == 'recipes':
            return 'recipes_db'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.model_name in self.recipes_models and model._meta.app_label == 'recipes':
            return 'recipes_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations between models in the same database
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Recipe models go to recipes_db, Favorite stays in default
        if app_label == 'recipes':
            if model_name in self.recipes_models:
                return db == 'recipes_db'
            else:
                # Favorite model stays in default database
                return db == 'default'
        return None
