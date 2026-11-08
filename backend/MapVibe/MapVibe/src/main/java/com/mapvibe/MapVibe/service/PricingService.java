package com.mapvibe.MapVibe.service;

import com.mapvibe.MapVibe.dto.request.*;
import com.mapvibe.MapVibe.dto.response.LocationResponse;
import com.mapvibe.MapVibe.dto.response.PricingCategoryResponse;
import com.mapvibe.MapVibe.dto.response.PricingItemResponse;
import com.mapvibe.MapVibe.dto.response.PricingOrderResponse;
import com.mapvibe.MapVibe.entity.Location;
import com.mapvibe.MapVibe.entity.PricingCategory;
import com.mapvibe.MapVibe.entity.PricingItem;
import com.mapvibe.MapVibe.entity.PricingOrder;
import com.mapvibe.MapVibe.exception.AppException;
import com.mapvibe.MapVibe.exception.ErrorCode;
import com.mapvibe.MapVibe.mapper.LocationMapper;
import com.mapvibe.MapVibe.repository.PricingItemRepository;
import com.mapvibe.MapVibe.repository.PricingOrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PricingService {

    PricingItemRepository pricingItemRepository;
    PricingOrderRepository pricingOrderRepository;
    LocationMapper locationMapper;

    public List<PricingItemResponse> getRootPricingItems(Long locationId) {
        return pricingItemRepository
                .findByLocationIdAndPricingCategoryIsNull(locationId)
                .stream()
                .map(locationMapper::toPricingItemResponse)
                .toList();
    }

    public List<PricingOrder> getPricingOrders(Long locationId) {
        return pricingOrderRepository
                .findByLocationIdOrderByDisplayOrderAsc(locationId);
    }

    public List<PricingCategoryResponse> getPricingCategories(
            Location location,
            List<PricingOrder> pricingOrders
    ) {
        return location.getPricingCategories()
                .stream()
                .map(category -> {

                    PricingCategoryResponse response =
                            locationMapper.toPricingCategoryResponse(
                                    category
                            );

                    response.setItems(
                            getOrderedCategoryItems(
                                    category,
                                    pricingOrders
                            )
                    );

                    return response;
                })
                .toList();
    }

    private List<PricingItemResponse> getOrderedCategoryItems(
            PricingCategory category,
            List<PricingOrder> pricingOrders
    ) {
        return pricingOrders.stream()
                .filter(order ->
                        order.getParentCategory() != null &&
                                order.getParentCategory()
                                        .getId()
                                        .equals(category.getId())
                )
                .sorted(
                        Comparator.comparing(
                                PricingOrder::getDisplayOrder
                        )
                )
                .map(PricingOrder::getPricingItem)
                .map(locationMapper::toPricingItemResponse)
                .toList();
    }

    public List<PricingOrderResponse> buildRootPricingOrderResponse(
            List<PricingOrder> pricingOrders
    ) {
        return pricingOrders.stream()
                .filter(order ->
                        order.getParentCategory() == null
                )
                .map(order -> {

                    if (order.getPricingItem() != null) {
                        return PricingOrderResponse.builder()
                                .type("item")
                                .id(order.getPricingItem().getId())
                                .build();
                    }

                    return PricingOrderResponse.builder()
                            .type("category")
                            .id(order.getPricingCategory().getId())
                            .build();
                })
                .toList();
    }

    public void enrichPricingResponse(
            Location location,
            LocationResponse response
    ) {
        response.setPricingItems(
                getRootPricingItems(location.getId())
        );

        List<PricingOrder> pricingOrders =
                getPricingOrders(location.getId());

        response.setPricingCategories(
                getPricingCategories(
                        location,
                        pricingOrders
                )
        );

        response.setPricingOrder(
                buildRootPricingOrderResponse(
                        pricingOrders
                )
        );
    }

    public void createPricing(
            Location location,
            LocationCreateRequest request
    ) {
        applyPricingOrder(location, request);
    }

    private void applyPricingOrder(
            Location location,
            LocationCreateRequest request
    ) {
        List<PricingOrder> orders = new ArrayList<>();

        /*
         * Root pricing blocks
         */
        if (request.getPricingOrder() != null) {

            Map<String, PricingItem> rootItemsByClientId =
                    new HashMap<>();

            if (request.getPricingItems() != null) {
                for (int i = 0;
                     i < request.getPricingItems().size();
                     i++) {

                    PricingItemRequest itemRequest =
                            request.getPricingItems().get(i);

                    if (itemRequest.getClientId() != null &&
                            location.getPricingItems() != null &&
                            i < location.getPricingItems().size()) {

                        PricingItem item =
                                location.getPricingItems().get(i);

                        /*
                         * Only root items belong here.
                         */
                        if (item.getPricingCategory() == null) {
                            rootItemsByClientId.put(
                                    itemRequest.getClientId(),
                                    item
                            );
                        }
                    }
                }
            }

            Map<String, PricingCategory> categoriesByClientId =
                    new HashMap<>();

            if (request.getPricingCategories() != null &&
                    location.getPricingCategories() != null) {

                for (int i = 0;
                     i < request.getPricingCategories().size();
                     i++) {

                    PricingCategoryRequest categoryRequest =
                            request.getPricingCategories().get(i);

                    if (categoryRequest.getClientId() != null &&
                            i < location.getPricingCategories().size()) {

                        categoriesByClientId.put(
                                categoryRequest.getClientId(),
                                location.getPricingCategories().get(i)
                        );
                    }
                }
            }

            for (int orderIndex = 0;
                 orderIndex < request.getPricingOrder().size();
                 orderIndex++) {

                PricingOrderRequest orderRequest =
                        request.getPricingOrder().get(orderIndex);

                PricingOrder order = PricingOrder.builder()
                        .location(location)
                        .displayOrder(orderIndex)
                        .parentCategory(null)
                        .build();

                if ("item".equals(orderRequest.getType())) {

                    PricingItem item =
                            rootItemsByClientId.get(
                                    orderRequest.getId()
                            );

                    if (item != null) {
                        order.setPricingItem(item);
                        orders.add(order);
                    }

                } else if ("category".equals(orderRequest.getType())) {

                    PricingCategory category =
                            categoriesByClientId.get(
                                    orderRequest.getId()
                            );

                    if (category != null) {
                        order.setPricingCategory(category);
                        orders.add(order);
                    }
                }
            }
        }

        /*
         * Items inside each category
         */
        if (location.getPricingCategories() != null) {

            for (PricingCategory category :
                    location.getPricingCategories()) {

                if (category.getItems() == null) {
                    continue;
                }

                for (int itemIndex = 0;
                     itemIndex < category.getItems().size();
                     itemIndex++) {

                    PricingItem item =
                            category.getItems().get(itemIndex);

                    PricingOrder order = PricingOrder.builder()
                            .location(location)
                            .pricingItem(item)
                            .pricingCategory(null)
                            .parentCategory(category)
                            .displayOrder(itemIndex)
                            .build();

                    orders.add(order);
                }
            }
        }

        location.setPricingOrders(orders);
    }

    @Transactional
    public void updatePricing(
            Location location,
            LocationUpdateRequest request
    ) {
        /*
         * pricing_order references old pricing entities,
         * so remove the old orders first.
         */
        if (location.getPricingOrders() == null) {
            location.setPricingOrders(new ArrayList<>());
        } else {
            location.getPricingOrders().clear();
        }

        /*
         * Sync pricing entities.
         */
        Map<String, PricingItem> rootItemsByClientId =
                updateRootPricingItems(location, request);

        Map<String, PricingCategory> categoriesByClientId =
                updatePricingCategories(location, request);

        /*
         * Rebuild pricing_order from the new state.
         */
        rebuildPricingOrder(
                location,
                request,
                rootItemsByClientId,
                categoriesByClientId
        );
    }

    private Map<String, PricingItem> updateRootPricingItems(
            Location location,
            LocationUpdateRequest request
    ) {
        if (location.getPricingItems() == null) {
            location.setPricingItems(new ArrayList<>());
        }

        List<PricingItem> existingRootItems =
                location.getPricingItems()
                        .stream()
                        .filter(item -> item.getPricingCategory() == null)
                        .toList();

        Map<Long, PricingItem> existingById =
                existingRootItems.stream()
                        .filter(item -> item.getId() != null)
                        .collect(Collectors.toMap(
                                PricingItem::getId,
                                Function.identity()
                        ));

        List<PricingItemRequest> requestedItems =
                request.getPricingItems() == null
                        ? List.of()
                        : request.getPricingItems();

        Set<Long> keptIds = new HashSet<>();

        Map<String, PricingItem> itemsByClientId =
                new HashMap<>();

        /*
         * Rebuild root item order in memory.
         */
        List<PricingItem> newRootItems =
                new ArrayList<>();

        for (PricingItemRequest itemRequest :
                requestedItems) {

            PricingItem item;

            if (itemRequest.getId() != null) {

                item = existingById.get(
                        itemRequest.getId()
                );

                if (item == null) {
                    throw new AppException(
                            ErrorCode.PRICING_ITEM_NOT_FOUND
                    );
                }

                keptIds.add(item.getId());

            } else {

                item = new PricingItem();
            }

            item.setLocation(location);
            item.setPricingCategory(null);
            item.setTitle(itemRequest.getTitle());
            item.setDescription(itemRequest.getDescription());
            item.setPrice(itemRequest.getPrice());

            newRootItems.add(item);

            if (itemRequest.getClientId() != null) {
                itemsByClientId.put(
                        itemRequest.getClientId(),
                        item
                );
            }
        }

        /*
         * Remove deleted root items from Location.
         */
        location.getPricingItems()
                .removeIf(item ->
                        item.getPricingCategory() == null &&
                                item.getId() != null &&
                                !keptIds.contains(item.getId())
                );

        /*
         * Add new root items.
         */
        for (PricingItem item : newRootItems) {
            if (!location.getPricingItems().contains(item)) {
                location.getPricingItems().add(item);
            }
        }

        return itemsByClientId;
    }

    private Map<String, PricingCategory> updatePricingCategories(
            Location location,
            LocationUpdateRequest request
    ) {
        if (location.getPricingCategories() == null) {
            location.setPricingCategories(new ArrayList<>());
        }

        List<PricingCategory> existingCategories =
                new ArrayList<>(
                        location.getPricingCategories()
                );

        Map<Long, PricingCategory> existingById =
                existingCategories.stream()
                        .filter(category -> category.getId() != null)
                        .collect(Collectors.toMap(
                                PricingCategory::getId,
                                Function.identity()
                        ));

        List<PricingCategoryRequest> requestedCategories =
                request.getPricingCategories() == null
                        ? List.of()
                        : request.getPricingCategories();

        Set<Long> keptIds = new HashSet<>();

        Map<String, PricingCategory> categoriesByClientId =
                new HashMap<>();

        /*
         * Desired category order.
         */
        List<PricingCategory> desiredCategories =
                new ArrayList<>();

        for (PricingCategoryRequest categoryRequest :
                requestedCategories) {

            PricingCategory category;

            if (categoryRequest.getId() != null) {

                category = existingById.get(
                        categoryRequest.getId()
                );

                if (category == null) {
                    throw new AppException(
                            ErrorCode.PRICING_CATEGORY_NOT_FOUND
                    );
                }

                keptIds.add(category.getId());

            } else {

                category = new PricingCategory();

                category.setLocation(location);
                category.setItems(new ArrayList<>());
            }

            category.setLocation(location);
            category.setCategoryTitle(
                    categoryRequest.getCategoryTitle()
            );

            updateCategoryItems(
                    location,
                    category,
                    categoryRequest.getItems()
            );

            desiredCategories.add(category);

            if (categoryRequest.getClientId() != null) {
                categoriesByClientId.put(
                        categoryRequest.getClientId(),
                        category
                );
            }
        }

        /*
         * Remove deleted categories from the managed collection.
         */
        location.getPricingCategories().removeIf(category ->
                category.getId() != null &&
                        !keptIds.contains(category.getId())
        );

        /*
         * Add newly created categories.
         */
        for (PricingCategory category : desiredCategories) {
            if (!location.getPricingCategories().contains(category)) {
                location.getPricingCategories().add(category);
            }
        }

        /*
         * Reorder the existing managed collection.
         * Do NOT replace the collection reference.
         */
        location.getPricingCategories().sort(
                Comparator.comparingInt(
                        desiredCategories::indexOf
                )
        );

        return categoriesByClientId;
    }

    private void updateCategoryItems(
            Location location,
            PricingCategory category,
            List<PricingItemRequest> requestedItems
    ) {
        if (category.getItems() == null) {
            category.setItems(new ArrayList<>());
        }

        if (location.getPricingItems() == null) {
            location.setPricingItems(new ArrayList<>());
        }

        List<PricingItem> existingItems =
                new ArrayList<>(
                        category.getItems()
                );

        Map<Long, PricingItem> existingById =
                existingItems.stream()
                        .filter(item -> item.getId() != null)
                        .collect(Collectors.toMap(
                                PricingItem::getId,
                                Function.identity()
                        ));

        List<PricingItemRequest> items =
                requestedItems == null
                        ? List.of()
                        : requestedItems;

        Set<Long> keptIds = new HashSet<>();

        /*
         * Desired item order inside this category.
         */
        List<PricingItem> desiredItems =
                new ArrayList<>();

        for (PricingItemRequest itemRequest : items) {

            PricingItem item;

            if (itemRequest.getId() != null) {

                item = existingById.get(
                        itemRequest.getId()
                );

                if (item == null) {
                    throw new AppException(
                            ErrorCode.PRICING_ITEM_NOT_FOUND
                    );
                }

                keptIds.add(item.getId());

            } else {

                item = new PricingItem();

                item.setLocation(location);
                item.setPricingCategory(category);
            }

            item.setLocation(location);
            item.setPricingCategory(category);
            item.setTitle(itemRequest.getTitle());
            item.setDescription(itemRequest.getDescription());
            item.setPrice(itemRequest.getPrice());

            desiredItems.add(item);

            /*
             * Keep Location.pricingItems in sync.
             */
            if (!location.getPricingItems().contains(item)) {
                location.getPricingItems().add(item);
            }
        }

        /*
         * Remove deleted items from the category.
         */
        category.getItems().removeIf(item ->
                item.getId() != null &&
                        !keptIds.contains(item.getId())
        );

        /*
         * Also remove deleted category items from
         * Location.pricingItems.
         */
        location.getPricingItems().removeIf(item ->
                item.getPricingCategory() != null &&
                        item.getPricingCategory().equals(category) &&
                        item.getId() != null &&
                        !keptIds.contains(item.getId())
        );

        /*
         * Add newly created items to category.items.
         */
        for (PricingItem item : desiredItems) {
            if (!category.getItems().contains(item)) {
                category.getItems().add(item);
            }
        }

        /*
         * Reorder managed collection.
         * Do NOT call category.setItems(desiredItems).
         */
        category.getItems().sort(
                Comparator.comparingInt(
                        desiredItems::indexOf
                )
        );
    }

    private void rebuildPricingOrder(
            Location location,
            LocationUpdateRequest request,
            Map<String, PricingItem> rootItemsByClientId,
            Map<String, PricingCategory> categoriesByClientId
    ) {
        List<PricingOrder> orders =
                location.getPricingOrders();

        /*
         * Root pricing blocks
         */
        if (request.getPricingOrder() != null) {

            for (int orderIndex = 0;
                 orderIndex < request.getPricingOrder().size();
                 orderIndex++) {

                PricingOrderRequest orderRequest =
                        request.getPricingOrder().get(orderIndex);

                PricingOrder order = PricingOrder.builder()
                        .location(location)
                        .displayOrder(orderIndex)
                        .parentCategory(null)
                        .pricingItem(null)
                        .pricingCategory(null)
                        .build();

                if ("item".equals(orderRequest.getType())) {

                    PricingItem item =
                            rootItemsByClientId.get(
                                    orderRequest.getId()
                            );

                    if (item != null) {
                        order.setPricingItem(item);
                        orders.add(order);
                    }

                } else if ("category".equals(
                        orderRequest.getType()
                )) {

                    PricingCategory category =
                            categoriesByClientId.get(
                                    orderRequest.getId()
                            );

                    if (category != null) {
                        order.setPricingCategory(category);
                        orders.add(order);
                    }
                }
            }
        }

        /*
         * Items inside categories.
         *
         * category.items already has the correct frontend order,
         * so no additional mapping is required.
         */
        if (location.getPricingCategories() != null) {

            for (PricingCategory category :
                    location.getPricingCategories()) {

                if (category.getItems() == null) {
                    continue;
                }

                for (int itemIndex = 0;
                     itemIndex < category.getItems().size();
                     itemIndex++) {

                    PricingItem item =
                            category.getItems().get(itemIndex);

                    PricingOrder order = PricingOrder.builder()
                            .location(location)
                            .pricingItem(item)
                            .pricingCategory(null)
                            .parentCategory(category)
                            .displayOrder(itemIndex)
                            .build();

                    orders.add(order);
                }
            }
        }
    }
}
