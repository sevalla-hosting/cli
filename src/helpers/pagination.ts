import type { ApiClient } from '../client/api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../client/types.ts';

export async function fetchAllPages<T>(
  client: ApiClient,
  path: string,
  query?: PaginationQuery & QueryParams,
): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;
  const perPage = query?.per_page ?? 100;

  while (true) {
    const response = await client.get<PaginatedResponse<T>>(path, {
      ...query,
      page,
      per_page: perPage,
    });

    allItems.push(...response.data);

    if (!response.pagination || page >= response.pagination.total_pages) {
      break;
    }

    page++;
  }

  return allItems;
}
