import React, { Component } from "react";
import QuotationDetailsItems from "./quotation-details-items";

const GetItineraryItemByDay = (day, items, type, userInfo, handleItemDelete, handleItemEdit, isRemovePriceAndActionButton) => {
    let itineraryItems = [];
    items.map(
        (item, key) => {
            if (item.offlineItem.business === "air" &&
                Number(day + 1) === Number(items && item.offlineItem.dayDepart) && !item.offlineItem.isRoundTrip)
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    departFlight={true}
                    returnFlight={false}
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={true}
                />)


            if (item.offlineItem.business === "air" &&
                Number(day + 1) === Number(items && item.offlineItem.dayDepart) && item.offlineItem.isRoundTrip)
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    departFlight={true}
                    returnFlight={false}
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={true}
                />)

            if (item.offlineItem.business === "air" &&
                item.offlineItem.isRoundTrip &&
                Number(day + 1) === Number(items && item.offlineItem.dayReturn))
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    departFlight={
                        Number(day + 1) ===
                        Number(items && item.offlineItem.dayReturn ? true : false)
                    }
                    returnFlight={
                        Number(day + 1) !==
                        Number(items && item.offlineItem.dayReturn ? true : false)
                    }
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={true}
                />)

            if (item.offlineItem.business !== "air" && item.offlineItem.business !== "custom" &&
                Number(day + 1) === Number(items && item.offlineItem.day))
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={true}
                />)

            if (item.offlineItem.business === "hotel" &&
                Number(day + 1) > Number(items && item.offlineItem.day) &&
                Number(day + 1) < Number(items && Number(item.offlineItem.day) + Number(item.offlineItem.nights)))
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={false}
                />)

            if (item.offlineItem.business === "custom" &&
                Number(day + 1) === Number(item.offlineItem.day === "All Days" ? 1 : items && item.offlineItem.day))
                itineraryItems.push(<QuotationDetailsItems
                    handleItemDelete={handleItemDelete}
                    item={item}
                    handleItemEdit={handleItemEdit}
                    userInfo={userInfo}
                    type={type}
                    isRemovePriceAndActionButton={true}
                />)
            return items;
        });
    return itineraryItems;
}


export default GetItineraryItemByDay;