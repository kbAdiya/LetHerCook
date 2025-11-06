import json
from django.core.management.base import BaseCommand
from recipes.models import Recipe
from django.conf import settings
from pathlib import Path


class Command(BaseCommand):
    help = 'Load recipes from JSON files into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing recipes before loading',
        )

    def handle(self, *args, **options):
        # JSON files are in the parent directory of recipe_back
        project_root = Path(settings.BASE_DIR).parent
        
        # Define the JSON files and their sources
        json_files = {
            'recipes_raw_nosource_ar.json': 'ar',
            'recipes_raw_nosource_epi.json': 'epi',
            'recipes_raw_nosource_fn.json': 'fn',
        }

        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing recipes...'))
            Recipe.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared all recipes'))

        total_loaded = 0
        total_errors = 0

        for json_file, source in json_files.items():
            file_path = project_root / json_file
            
            if not file_path.exists():
                self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
                continue

            self.stdout.write(self.style.SUCCESS(f'Loading recipes from {json_file}...'))
            
            try:
                with open(str(file_path), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                count = 0
                errors = 0
                
                for recipe_id, recipe_data in data.items():
                    try:
                        # Clean up ingredients - remove "ADVERTISEMENT" text
                        ingredients = recipe_data.get('ingredients', [])
                        cleaned_ingredients = [
                            ing.replace('ADVERTISEMENT', '').strip() 
                            for ing in ingredients 
                            if ing and ing.strip() != 'ADVERTISEMENT'
                        ]
                        
                        # Get picture_link, handle null
                        picture_link = recipe_data.get('picture_link')
                        if picture_link is None:
                            picture_link = ''
                        
                        Recipe.objects.update_or_create(
                            recipe_id=recipe_id,
                            defaults={
                                'title': recipe_data.get('title', ''),
                                'ingredients': cleaned_ingredients,
                                'instructions': recipe_data.get('instructions', ''),
                                'picture_link': picture_link,
                                'source': source,
                            }
                        )
                        count += 1
                        
                        if count % 100 == 0:
                            self.stdout.write(f'  Loaded {count} recipes...', ending='\r')
                            
                    except Exception as e:
                        errors += 1
                        if errors <= 10:  # Only show first 10 errors
                            self.stdout.write(self.style.WARNING(f'Error loading recipe {recipe_id}: {str(e)}'))
                
                total_loaded += count
                total_errors += errors
                self.stdout.write(self.style.SUCCESS(f'  ✓ Loaded {count} recipes from {json_file} (errors: {errors})'))
                
            except json.JSONDecodeError as e:
                self.stdout.write(self.style.ERROR(f'JSON decode error in {json_file}: {str(e)}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing {json_file}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS(f'\nTotal: {total_loaded} recipes loaded, {total_errors} errors'))

