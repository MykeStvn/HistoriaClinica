# Generated by Django 5.1.4 on 2024-12-22 04:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_usuarios_tipo_usuario'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuarios',
            name='especialidad',
            field=models.CharField(blank=True, choices=[('medico_general', 'Médico General'), ('admisionista', 'Admisionista')], max_length=50, null=True, verbose_name='Especialidad'),
        ),
    ]
