from django.contrib import admin
from .models import Hero, DailyHero, Ability, DailyAbility

admin.site.register(Hero)
admin.site.register(DailyHero)
admin.site.register(Ability)
admin.site.register(DailyAbility)