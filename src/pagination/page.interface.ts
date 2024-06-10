export interface Page<T> {
    items: T[],
    total_size: number,
    page_size: number,
    page_index: number
}
