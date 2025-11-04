from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math


class SpringStylePagination(PageNumberPagination):
    page_query_param = "page"
    page_size_query_param = "size"
    page_size = 10
    max_page_size = 100

    def get_page_number(self, request, paginator):
        try:
            page_number = int(request.query_params.get(self.page_query_param, 0)) + 1
            if page_number < 1:
                page_number = 1
        except (TypeError, ValueError):
            page_number = 1
        return page_number

    def get_paginated_response(self, data):
        page_number = self.page.number - 1  # make it 0-based
        page_size = self.get_page_size(self.request)
        total_elements = self.page.paginator.count
        total_pages = math.ceil(total_elements / page_size) if page_size else 1
        number_of_elements = len(data)

        return Response(
            {
                "content": data,
                "pageable": {"pageNumber": page_number, "pageSize": page_size},
                "last": not self.page.has_next(),
                "totalPages": total_pages,
                "totalElements": total_elements,
                "size": page_size,
                "number": page_number,
                "first": not self.page.has_previous(),
                "numberOfElements": number_of_elements,
                "empty": number_of_elements == 0,
            }
        )
