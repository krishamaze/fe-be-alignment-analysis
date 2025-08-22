from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=255)
    logo = models.URLField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now=True)
    date_modified = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Contact(models.Model):
    name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=10)
    message = models.TextField(max_length=1555)
    date_added = models.DateTimeField(auto_now=True)
    date_modified = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ScheduleCall(models.Model):
    name = models.CharField(max_length=255)
    date = models.CharField(max_length=255)
    time = models.CharField(max_length=255)
    message = models.TextField(max_length=855, blank=True, null=True)

    def __str__(self):
        return self.name
