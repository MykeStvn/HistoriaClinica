# Generated by Django 5.1.4 on 2025-01-23 03:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion_pacientes', '0002_historialclinico_fk_id_doctor'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='historialclinico',
            name='fk_id_doctor',
            field=models.ForeignKey(blank=True, db_column='fk_id_doctor', limit_choices_to={'tipo_usuario': 'doctor'}, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='historiales_doctor', to=settings.AUTH_USER_MODEL, verbose_name='Doctor'),
        ),
    ]
