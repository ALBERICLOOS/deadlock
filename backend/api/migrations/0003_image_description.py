# Generated by Django 5.1.1 on 2024-09-11 11:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="image",
            name="description",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
