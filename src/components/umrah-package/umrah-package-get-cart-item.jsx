import moment from "moment";

export const UmrahPackageGetItem = (item) => {
  if (item.itemDtl) {
    return {
      business: item.itemDtl.business || "",
      fromLocation: item.itemDtl.fromLocation || item.itemDtl.locationInfo.fromLocation.Id || "",
      toLocation:
        item.itemDtl.locationInfo.fromLocation.address ||
        item.itemDtl.locationInfo.fromLocation.city ||
        "",
      toLocationCity: item.itemDtl.locationInfo.fromLocation.city || "",
      name: item.itemDtl.name || "",
      startDate: item.itemDtl.dateInfo.startDate || "",
      endDate: item.itemDtl.dateInfo.endDate || "",
      costPrice: getTotalAmount(item) || "",
      sellPrice: getTotalAmount(item) || "",
      vendor: item.itemDtl.vendor || "",
      brn: item.itemDtl.brn || "",
      itemType: getItemTypes(item) || "",
      noRooms: getItemCount(item) || "",
      rating: item.itemDtl.rating || "",
      duration: item.itemDtl.tpExtension.find((x) => x.key === "duration")?.value || "",
      guests:
        item.itemDtl.items[0]?.properties?.pax?.adult ||
        item.itemDtl.paxInfo.find((x) => x.quantity)?.quantity ||
        "",
      adult: item.itemDtl.adult || "",
      child: item.itemDtl.child || "",
      infant: item.itemDtl.infant || "",
      pickupType: item.itemDtl.pickupType || "",
      dropoffType: item.itemDtl.dropoffType || "",
      pickupTime: item.itemDtl.pickupTime || "",
      departStartDate: item.itemDtl.departStartDate || "",
      departEndDate: item.itemDtl.departEndDate || "",
      departStartTime: item.itemDtl.departStartTime || "",
      departEndTime: item.itemDtl.departEndTime || "",
      departAirlineName: item.itemDtl.departAirlineName || "",
      departFlightNumber: item.itemDtl.departFlightNumber || "",
      departClass: item.itemDtl.departClass || "",
      departStops: item.itemDtl.departStops || "",
      departDuration: item.itemDtl.departDuration || "",
      returnStartDate: item.itemDtl.returnStartDate || "",
      returnEndDate: item.itemDtl.returnEndDate || "",
      returnStartTime: item.itemDtl.returnStartTime || "",
      returnEndTime: item.itemDtl.returnEndTime || "",
      returnAirlineName: item.itemDtl.returnAirlineName || "",
      returnFlightNumber: item.itemDtl.returnFlightNumber || "",
      returnClass: item.itemDtl.returnClass || "",
      returnStops: item.itemDtl.returnStops || "",
      returnDuration: item.itemDtl.returnDuration || "",
      isRoundTrip: item.itemDtl.isRoundTrip || "",
      uuid: item.itemDtl.uuid || "",
      day: getItemDay(item) || 1,
      toDay: item.itemDtl.toDay || 1,
      nights: getItemNights(item) || 1,
      dayDepart: item.itemDtl.dayDepart || 1,
      dayDepartEnd: item.itemDtl.dayDepartEnd || 1,
      dayReturn: item.itemDtl.dayReturn || 1,
      dayReturnEnd: item.itemDtl.dayReturnEnd || 1,
      dates: item.itemDtl.dates || "",
      datesIsValid: item.itemDtl.datesIsValid || "",
      cutOfDays: item.itemDtl.cutOfDays || 7,
      stayInDays: item.itemDtl.stayInDays || 7,
      description: "",
      imgUrl: item.itemDtl?.images.find((x) => x.isDefault)?.url || "",
      details: item.itemDtl,
      removeRequest: item.removeRequest
    };
  } else if (item.business === "air") {
    let itemDepart = item.items[0];
    let itemReturn = item.tripType === "roundtrip" ? item.items[1] : item.items[0];

    return {
      business: item.business || "",
      fromLocation: itemDepart.locationInfo.fromLocation.id || "",
      toLocation: itemDepart.locationInfo.toLocation.id || "",
      toLocationCity: "",
      name: "",
      startDate: "",
      endDate: "",
      costPrice: item.amount || "",
      sellPrice: item.amount || "",
      vendor: item.vendor || "",
      brn: item.brn || "",
      itemType: "",
      noRooms: "",
      rating: "",
      duration: "",
      guests: "",
      adult: item.paxInfo.find((x) => x.typeString === "ADT")?.quantity || 1,
      child: item.paxInfo.find((x) => x.typeString === "CHD")?.quantity || "",
      infant: item.paxInfo.find((x) => x.typeString === "INF")?.quantity || "",
      pickupType: "",
      dropoffType: "",
      pickupTime: "",
      departStartDate: itemDepart.dateInfo.startDate || "",
      departEndDate: itemDepart.dateInfo.endDate || "",
      departStartTime: moment(itemDepart.dateInfo.startDate).format("HH:mm") || "",
      departEndTime: moment(itemDepart.dateInfo.endDate).format("HH:mm") || "",
      departAirlineName: itemDepart.item[0].vendors[0].item.name || "",
      departFlightNumber: itemDepart.item[0].code || "",
      departClass: itemDepart.item[0].tpExtension.find((x) => x.key === "cabinClass")?.value || "",
      departStops: itemDepart.item.length - 1 || "",
      departDuration:
        itemDepart.tpExtension.find((x) => x.key === "durationHours").value +
        "h " +
        itemDepart.tpExtension.find((x) => x.key === "durationMinutes").value +
        "m" || "",
      departImg: itemDepart.item[0].images.find((x) => x.type === "default").url || "",
      returnStartDate: itemReturn.dateInfo.startDate || "",
      returnEndDate: itemReturn.dateInfo.endDate || "",
      returnStartTime: moment(itemReturn.dateInfo.startDate).format("HH:mm") || "",
      returnEndTime: moment(itemReturn.dateInfo.endDate).format("HH:mm") || "",
      returnAirlineName: itemReturn.item[0].vendors[0].item.name || "",
      returnFlightNumber: itemReturn.item[0].code || "",
      returnClass:
        itemReturn.item[0].tpExtension.find((x) => x.key === "cabinClass")?.value ||
        itemDepart.item[0].tpExtension.find((x) => x.key === "cabinClass")?.value ||
        "",
      returnStops: itemReturn.item.length - 1 || "",
      returnDuration:
        itemReturn.tpExtension.find((x) => x.key === "durationHours").value +
        "h " +
        itemReturn.tpExtension.find((x) => x.key === "durationMinutes").value +
        "m" || "",
      returnImg: itemReturn.item[0].images.find((x) => x.type === "default").url || "",
      isRoundTrip: (item?.tripType === "roundtrip" ? true : false) || "",
      uuid: item.uuid || "",
      day: getFlightDayForItinerary(item.dateInfo.startDate, item.dateInfo.endDate, item.locationInfo) || 1,
      toDay: item.toDay || 1,
      nights: item.nights || 1,
      dayDepart: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.startDate) || 1,
      dayDepartEnd: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.endDate) || 1,
      dayReturn: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.startDate) || 1,
      dayReturnEnd: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.endDate) || 1,
      dates: item.dates || "",
      datesIsValid: item.datesIsValid || "",
      cutOfDays: item.cutOfDays || 7,
      stayInDays: item.stayInDays || 7,
      description: "",
      removeRequest: item.removeRequest
    };
  }
};

const getTotalAmount = (item) => {
  if (item.isFromList) {
    return item.itemDtl.amount;
  } else {
    if (item.itemDtl.business === "hotel") {
      if (item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms) {
        return item.itemDtl.items.find((x) => x.id === item.roomId).amount;
      } else {
        let totalAmount = 0;
        item.roomId.map((room) => {
          let roomAmount = item.itemDtl.items
            .find((x) => x.id === room.groupid)
            .item.find((y) => y.code === room.roomCode).amount;
          totalAmount = roomAmount + totalAmount;
        });
        return totalAmount;
      }
    } else if (item.itemDtl.business === "transportation" || item.itemDtl.business === "groundservice") {
      return item.removeRequest.Request.Data.reduce((sum, data) => {
        var obj = item.itemDtl.items.flatMap((i, index) => { return i.item; }).filter(x => x.code === data.Value);
        var amount = obj[0].displayRateInfo.find(x => x.purpose === "10").amount * parseInt(data.Quantity??1);
        return sum += amount;
      }, 0)
      //return item.itemDtl.amount;
    }
    else {
      return item.itemDtl.items.find((x) => x).item.find((x) => x.code === item.roomCode).amount;
    }
  }
};

const getItemTypes = (item) => {
  if (item.isFromList) {
    return item.itemDtl.items.map((room, key) => room.item.find((x) => x).name);
  } else {
    if (item.itemDtl.business === "hotel") {
      if (item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms) {
        return [...new Set(item.itemDtl.items.find((x) => x.id === item.roomId).item.map((room) => room.name))];
      } else {
        let itemTypes = "";
        item.roomId.map((room) => {
          let itemType = item.itemDtl.items
            .find((x) => x.id === room.groupid)
            .item.find((y) => y.code === room.roomCode).name;
          if(!itemTypes.includes(itemType))
            itemTypes = itemTypes + itemType;
        });
        return itemTypes;
      }
    } else {
      return item.itemDtl.items.map(
        (x) =>
          x.item.find((y) => y.id === item.roomId) && x.item.find((y) => y.id === item.roomId).name
      );
    }
  }
};

const getItemCount = (item) => {
  if (item.isFromList) {
    if (item.itemDtl.items.length > 1) {
      return item.itemDtl.items.length;
    } else {
      return item.itemDtl.items[0].item.length;
    }
  } else {
    if (item.itemDtl.business === "hotel") {
      if (item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms) {
        return item.itemDtl.items.find((x, key) => x.id === item.roomId).item.length;
      } else {
        return item.roomId.length;
      }
    }
  }
};

const getItemNights = (item) => {
  let nights = moment(item.itemDtl.dateInfo.endDate).diff(
    moment(item.itemDtl.dateInfo.startDate),
    "days"
  );
  return nights;
};

const getItemDay = (item) => {
  let itemDay;
  item.itemDtl.business === "activity" &&
    item.itemDtl.items.map(
      (x) =>
        x.item.find((y) => y.id === item.roomId) &&
        (itemDay =
          moment(x.item.find((y) => y.id === item.roomId).dateInfo.startDate).diff(
            moment(item.itemDtl.dateInfo.startDate),
            "days"
          ) + 1)
    );
  return itemDay;
};

const getFlightDay = (startDate, endDate) => {
  let day = moment(endDate).diff(moment(startDate), "days");
  if (moment(startDate).format("DD/MM/YYYY") === moment(endDate).format("DD/MM/YYYY")) {
    day = day + 1;
  } else {
    day = day + 2;
  }

  return day;
};

const getFlightDayForItinerary = (startDate, endDate, locationInfo) => {
  var umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"))
  let day = 0;
  if (umrahPackageDetails.umrahArrivalAirLocationCode === locationInfo.toLocation.id)
    day = moment(startDate).diff(moment(umrahPackageDetails.startDate), "days");
  if (umrahPackageDetails.umrahDepartureAirLocationCode === locationInfo.fromLocation.id)
    day = moment(startDate).diff(moment(umrahPackageDetails.startDate), "days");
  if (day <= 0)
    day = 0;
  day++;
  return day;
};
