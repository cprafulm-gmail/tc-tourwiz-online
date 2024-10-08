import moment from "moment";
import * as Global from "../../helpers/global";

export const getItem = (item) => {
  if (item.itemDtl) {
    return {
      business: item.itemDtl.business || "",
      fromLocation: item.itemDtl.fromLocation || "",
      fromLocationName: (item.itemDtl.fromLocation ? item.itemDtl.fromLocation.name : item.itemDtl.fromLocation) || "",
      fromLocationCity: (item.itemDtl.fromLocation ? item.itemDtl.fromLocation.city : item.itemDtl.fromLocation) || "",
      toLocation: item.itemDtl.business === "transfers" ? item.itemDtl.toLocation :
        item.itemDtl.locationInfo.fromLocation.address ||
        item.itemDtl.locationInfo.fromLocation.city ||
        "",
      toLocationName: (item.itemDtl.fromLocation ? item.itemDtl.fromLocation.name : item.itemDtl.fromLocation) || "",
      toLocationCity: (item.itemDtl.fromLocation ? item.itemDtl.locationInfo.fromLocation.city : item.itemDtl.fromLocation) || "",
      name: item.itemDtl.name ? item.itemDtl.name.replace("&amp;", "&").replace("&apos;", "'") : "",
      startDate: item.itemDtl.dateInfo.startDate || "",
      endDate: item.itemDtl.dateInfo.endDate || "",
      costPrice: getTotalAmount(item) || "0",
      sellPrice: getTotalAmount(item) || "0",
      vendor: item.itemDtl.vendor || "",
      brn: item.itemDtl.brn || "",
      itemType: getItemTypes(item) || "",
      otherType: "",
      noRooms: getItemCount(item) || "1",
      rating: item.itemDtl.rating || "",
      duration:
        item.itemDtl.tpExtension.find((x) => x.key === "duration")?.value || "",
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
      departStops: item.itemDtl.departStops || [],
      departDuration: item.itemDtl.departDuration || "",
      totaldepartDuration: item.itemDtl.totaldepartDuration || "",
      returnStartDate: item.itemDtl.returnStartDate || "",
      returnEndDate: item.itemDtl.returnEndDate || "",
      returnStartTime: item.itemDtl.returnStartTime || "",
      returnEndTime: item.itemDtl.returnEndTime || "",
      returnAirlineName: item.itemDtl.returnAirlineName || "",
      returnFlightNumber: item.itemDtl.returnFlightNumber || "",
      returnClass: item.itemDtl.returnClass || "",
      returnStops: item.itemDtl.returnStops || [],
      totalreturnDuration: item.itemDtl.totalreturnDuration || "",
      returnDuration: item.itemDtl.returnDuration || "",
      isRoundTrip: item.itemDtl.isRoundTrip || "",
      uuid: item.itemDtl.uuid || "",
      day: getItemDay(item) || 1,
      toDay: item.itemDtl.toDay || 1,
      nights: getItemNights(item) || 1,
      hotelPaxInfo: item.itemDtl.hotelPaxInfo || [],
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
      mealType: item.itemDtl.mealType || "",
      hotelContactNumber: item.itemDtl.hotelContactNumber || "",
      taxType: item.itemDtl?.taxType || "CGSTSGST",
      percentage: item.itemDtl?.percentage || 0, //Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"),
    };
  } else if (item.business === "air") {
    let itemDepart = item.items[0];
    let itemReturn = item.tripType === "roundtrip" ? item.items[1] : item.items[0];
    if (item.tripType === "roundtrip" && item.isDomestic) {
      return {
        business: item.business || "",
        fromLocation: itemDepart.locationInfo.fromLocation.id || "",
        fromLocationName: itemDepart.locationInfo.fromLocation.name || "",
        fromLocationCity: itemDepart.locationInfo.fromLocation.city || "",
        toLocation: itemDepart.locationInfo.toLocation.id || "",
        toLocationName: itemDepart.locationInfo.toLocation.name || "",
        toLocationCity: itemDepart.locationInfo.toLocation.city || "",
        name: "",
        startDate: moment(item.dateInfo.startDate).format('YYYY-MM-DD') || "",
        endDate: moment(item.dateInfo.endDate).format('YYYY-MM-DD') || "",
        costPrice: item.amount !== "" ? item.amount : "0",
        sellPrice: item.amount !== "" ? item.amount : "0",
        vendor: item.vendor || "",
        brn: item.brn || "",
        itemType: "",
        otherType: "",
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
        departStartDate: moment(itemDepart.dateInfo.startDate).format('YYYY-MM-DD') || "",
        departEndDate: moment(itemDepart.dateInfo.endDate).format('YYYY-MM-DD') || "",
        departStartTime: moment(itemDepart.dateInfo.startDate).format("HH:mm") || "",
        departEndTime: moment(itemDepart.dateInfo.endDate).format("HH:mm") || "",
        departAirlineName: itemDepart.items[0].item[0].vendors[0].item.name || "",
        departFlightNumber: itemDepart.items[0].item[0].code || "",
        departClass: itemDepart.items[0].item[0].tpExtension.find((x) => x.key === "cabinClass")?.value || "",
        departStops: itemDepart.items[0].item.length - 1 || [],
        totaldepartDuration: itemDepart.totalDuration || "",
        departDuration:
          itemDepart.items[0].tpExtension.find((x) => x.key === "durationHours").value +
          "h " +
          itemDepart.items[0].tpExtension.find((x) => x.key === "durationMinutes").value +
          "m" || "",
        departImg: itemDepart.images.find((x) => x.type === "default").url || "",
        returnStartDate: moment(itemReturn.dateInfo.startDate).format('YYYY-MM-DD') || "",
        returnEndDate: moment(itemReturn.dateInfo.endDate).format('YYYY-MM-DD') || "",
        returnStartTime: moment(itemReturn.dateInfo.startDate).format("HH:mm") || "",
        returnEndTime: moment(itemReturn.dateInfo.endDate).format("HH:mm") || "",
        returnAirlineName: itemReturn.items[0].item[0].vendors[0].item.name || "",
        returnFlightNumber: itemReturn.items[0].item[0].code || "",
        returnClass:
          itemReturn.items[0].item[0].tpExtension.find((x) => x.key === "cabinClass")?.value ||
          itemDepart.items[0].item[0].tpExtension.find((x) => x.key === "cabinClass")?.value ||
          "",
        returnStops: itemReturn.items[0].item.length - 1 || [],
        totalreturnDuration: itemReturn.totalDuration || "",
        returnDuration:
          itemReturn.items[0].tpExtension.find((x) => x.key === "durationHours").value +
          "h " +
          itemReturn.items[0].tpExtension.find((x) => x.key === "durationMinutes").value +
          "m" || "",
        returnImg: itemReturn.images.find((x) => x.type === "default").url || "",
        isRoundTrip: (item?.tripType === "roundtrip" ? true : false) || "",
        uuid: item.uuid || "",
        day: item.day || 1,
        toDay: item.toDay || 1,
        nights: item.nights || 1,
        hotelPaxInfo: [],
        dayDepart: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.startDate) || 1,
        dayDepartEnd: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.endDate) || 1,
        dayReturn: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.startDate) || 1,
        dayReturnEnd: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.endDate) || 1,
        dates: item.dates || "",
        datesIsValid: item.datesIsValid || "",
        cutOfDays: item.cutOfDays || 7,
        stayInDays: item.stayInDays || 7,
        description: "",
      };
    }
    else {
      return {
        business: item.business || "",
        fromLocation: itemDepart.locationInfo.fromLocation.id || "",
        fromLocationName: itemDepart.locationInfo.fromLocation.name || "",
        fromLocationCity: itemDepart.locationInfo.fromLocation.city || "",
        toLocation: itemDepart.locationInfo.toLocation.id || "",
        toLocationName: itemDepart.locationInfo.toLocation.name || "",
        toLocationCity: itemDepart.locationInfo.toLocation.city || "",
        name: "",
        startDate: item.dateInfo.startDate || "",
        endDate: item.dateInfo.endDate || "",
        costPrice: item.amount !== "" ? item.amount : "0",
        sellPrice: item.amount !== "" ? item.amount : "0",
        vendor: item.vendor || "",
        brn: item.brn || "",
        itemType: "",
        otherType: "",
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
        departStops: itemDepart.item.length - 1 || [],
        totaldepartDuration: itemDepart.item[0].journeyDuration || "",
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
        returnStops: itemReturn.item.length - 1 || [],
        totalreturnDuration: itemReturn.item[0].journeyDuration || "",
        returnDuration:
          itemReturn.tpExtension.find((x) => x.key === "durationHours").value +
          "h " +
          itemReturn.tpExtension.find((x) => x.key === "durationMinutes").value +
          "m" || "",
        returnImg: itemReturn.item[0].images.find((x) => x.type === "default").url || "",
        isRoundTrip: (item?.tripType === "roundtrip" ? true : false) || "",
        uuid: item.uuid || "",
        day: item.day || 1,
        toDay: item.toDay || 1,
        nights: item.nights || 1,
        hotelPaxInfo: [],
        dayDepart: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.startDate) || 1,
        dayDepartEnd: getFlightDay(itemDepart.dateInfo.startDate, itemDepart.dateInfo.endDate) || 1,
        dayReturn: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.startDate) || 1,
        dayReturnEnd: getFlightDay(itemDepart.dateInfo.startDate, itemReturn.dateInfo.endDate) || 1,
        dates: item.dates || "",
        datesIsValid: item.datesIsValid || "",
        cutOfDays: item.cutOfDays || 7,
        stayInDays: item.stayInDays || 7,
        description: "",
      };
    }

  } else if (item.itemDtlMeta) {
    if (item.itemDtlMeta.triptype === "roundtrip" && item.itemDtlMeta.businessName === "air") {
      let itemDepart = item.itemDtlMeta.itemDtlMeta[0];
      let itemReturn = item.itemDtlMeta.itemDtlMeta[1];
      let departstartTime = moment(itemDepart.departureDate);
      let departendTime = moment(itemDepart.arrivalDate);
      let departdurationdiff = moment.duration(departendTime.diff(departstartTime));
      let departhoursduration = parseInt(departdurationdiff.asHours());
      let departminuteduration = parseInt(departdurationdiff.asMinutes()) % 60;
      const departduration = departhoursduration +
        "h " +
        departminuteduration +
        "m";

      let returnstartTime = moment(itemReturn.departureDate);
      let returnendTime = moment(itemReturn.arrivalDate);
      let returndurationdiff = moment.duration(returnendTime.diff(returnstartTime));
      let returnhoursduration = parseInt(returndurationdiff.asHours());
      let returnminuteduration = parseInt(returndurationdiff.asMinutes()) % 60;
      const returnduration = returnhoursduration +
        "h " +
        returnminuteduration +
        "m";

      return {
        business: "air",
        fromLocation: itemDepart.departureCode || "",
        fromLocationName: itemDepart.departureAirport || "",
        fromLocationCity: itemDepart.departureAirport || "",
        toLocation: itemDepart.arrivalCode || "",
        toLocationName: itemDepart.arrivalAirport || "",
        toLocationCity: itemDepart.arrivalAirport || "",
        name: "",
        startDate: moment(itemDepart.startDate).format('YYYY-MM-DD') || "",
        endDate: moment(itemDepart.endDate).format('YYYY-MM-DD') || "",
        departStartDate: moment(itemDepart.departureDate).format('YYYY-MM-DD') || "",
        departEndDate: moment(itemDepart.arrivalDate).format('YYYY-MM-DD') || "",
        departStartTime: itemDepart.departureTime || "",
        departEndTime: itemDepart.arrivalTime || "",
        departAirlineName: itemDepart.airlineName || "",
        departFlightNumber: itemDepart.flightNumber || "",
        departClass: itemDepart.departClass || "",
        departStops: itemDepart.stops || [],
        totaldepartDuration: itemDepart.totalDuration || "",
        departDuration: departduration || "",
        adult: 1,
        child: "",
        infant: "",

        returnStartDate: moment(itemReturn.departureDate).format('YYYY-MM-DD') || "",
        returnEndDate: moment(itemReturn.arrivalDate).format('YYYY-MM-DD') || "",
        returnStartTime: itemReturn.departureTime || "",
        returnEndTime: itemReturn.arrivalTime || "",
        returnAirlineName: itemReturn.airlineName || "",
        returnFlightNumber: itemReturn.flightNumber || "",
        returnClass: itemReturn.departClass || "",
        returnStops: itemReturn.stops || [],
        totalreturnDuration: itemReturn.totalDuration || "",
        returnDuration: returnduration || "",
        uuid: itemDepart.uuid || "",
        day: itemDepart.day || 1,
        toDay: itemDepart.toDay || 1,
        nights: itemDepart.nights || 1,
        hotelPaxInfo: [],
        dayDepart: itemDepart.dayDepart || 1,
        dayDepartEnd: itemDepart.dayDepartEnd || 1,
        dayReturn: item.itemDtlMeta.dayReturn || 1,
        dayReturnEnd: item.itemDtlMeta.dayReturnEnd || 1,
        dates: itemReturn.dates || "",
        datesIsValid: itemReturn.datesIsValid || "",
        cutOfDays: itemReturn.cutOfDays || 7,
        stayInDays: itemReturn.stayInDays || 7,
        isRoundTrip: true,
        taxType: itemDepart?.taxType || "CGSTSGST",
        percentage: itemDepart?.percentage || 0, //Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"),
        isTax1Modified: item.itemDtlEdit?.isTax1Modified || false,
        isTax2Modified: item.itemDtlEdit?.isTax2Modified || false,
        isTax3Modified: item.itemDtlEdit?.isTax3Modified || false,
        isTax4Modified: item.itemDtlEdit?.isTax4Modified || false,
        isTax5Modified: item.itemDtlEdit?.isTax5Modified || false,
      };
    }
    else if (item.itemDtlMeta.businessName && item.itemDtlMeta.businessName === "air") {
      let startTime = moment(item.itemDtlMeta.departureDate);
      let endTime = moment(item.itemDtlMeta.arrivalDate);
      let durationdiff = moment.duration(endTime.diff(startTime));
      let hoursduration = parseInt(durationdiff.asHours());
      let minuteduration = parseInt(durationdiff.asMinutes()) % 60;
      const duration = hoursduration +
        "h " +
        minuteduration +
        "m";
      return {
        business: "air",
        fromLocation: item.itemDtlMeta.departureCode || "",
        fromLocationName: item.itemDtlMeta.departureAirport || "",
        fromLocationCity: item.itemDtlMeta.departureAirport || "",
        toLocation: item.itemDtlMeta.arrivalCode || "",
        toLocationName: item.itemDtlMeta.arrivalAirport || "",
        toLocationCity: item.itemDtlMeta.arrivalAirport || "",
        name: "",
        startDate: moment(item.itemDtlMeta.startDate).format('YYYY-MM-DD') || "",
        endDate: moment(item.itemDtlMeta.endDate).format('YYYY-MM-DD') || "",
        departStartDate: moment(item.itemDtlMeta.departureDate).format('YYYY-MM-DD') || "",
        departEndDate: moment(item.itemDtlMeta.arrivalDate).format('YYYY-MM-DD') || "",
        departStartTime: item.itemDtlMeta.departureTime || "",
        departEndTime: item.itemDtlMeta.arrivalTime || "",
        departAirlineName: item.itemDtlMeta.airlineName || "",
        departFlightNumber: item.itemDtlMeta.flightNumber || "",
        departClass: item.itemDtlMeta.departClass || "",
        departStops: item.itemDtlMeta.stops || [],
        totaldepartDuration: item.itemDtlMeta.totalDuration || "",
        departDuration: duration || "",
        totalreturnDuration: "",
        returnDuration: "",
        returnStartDate: moment(item.itemDtlMeta.startDate).format('YYYY-MM-DD') || "",
        returnEndDate: moment(item.itemDtlMeta.endDate).format('YYYY-MM-DD') || "",
        returnStartTime: "",
        returnEndTime: "",
        returnAirlineName: "",
        returnFlightNumber: "",
        returnClass: "",
        returnStops: "",
        totalreturnDuration: "",
        returnDuration: "",
        adult: 1,
        child: "",
        infant: "",

        uuid: item.itemDtlMeta.uuid || "",
        day: item.itemDtlMeta.day || 1,
        toDay: item.itemDtlMeta.toDay || 1,
        nights: item.itemDtlMeta.nights || 1,
        hotelPaxInfo: [],
        dayDepart: item.itemDtlMeta.dayDepart || 1,
        dayDepartEnd: item.itemDtlMeta.dayDepartEnd || 1,
        dayReturn: item.itemDtlMeta.dayReturn || 1,
        dayReturnEnd: item.itemDtlMeta.dayReturnEnd || 1,
        dates: item.itemDtlMeta.dates || "",
        datesIsValid: item.itemDtlMeta.datesIsValid || "",
        cutOfDays: item.itemDtlMeta.cutOfDays || 7,
        stayInDays: item.itemDtlMeta.stayInDays || 7,
        isRoundTrip: false,
        taxType: item.itemDtl?.itemDtlMeta || "CGSTSGST",
        percentage: item.itemDtlMeta?.percentage || 0, //Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"),
        isTax1Modified: item.itemDtlEdit?.isTax1Modified || false,
        isTax2Modified: item.itemDtlEdit?.isTax2Modified || false,
        isTax3Modified: item.itemDtlEdit?.isTax3Modified || false,
        isTax4Modified: item.itemDtlEdit?.isTax4Modified || false,
        isTax5Modified: item.itemDtlEdit?.isTax5Modified || false,
      };
    }
    else {
      var tpExtentions = []
      if (item.itemDtlMeta.businessName === "activity") {
        if (item.itemDtlMeta.inclusions) {
          tpExtentions.push({ key: "inclusions", value: item.itemDtlMeta.inclusions })
        }

        if (item.itemDtlMeta.exclusions) {
          tpExtentions.push({ key: "exclusions", value: item.itemDtlMeta.exclusions })
        }
        item.itemDtlMeta.tpExtension = tpExtentions
      }

      return {
        business: item.itemDtlMeta.businessName ? item.itemDtlMeta.businessName : "hotel",
        fromLocation: item.itemDtlMeta.address || "",
        fromLocationName: item.itemDtlMeta.name || "",
        fromLocationCity: item.itemDtlMeta.city || "",
        toLocation: item.itemDtlMeta.address || item.itemDtlMeta.city || "",
        toLocationName: item.itemDtlMeta.name || "",
        toLocationCity: item.itemDtlMeta.city || "",
        name: item.itemDtlMeta.name ? item.itemDtlMeta.name.replace("&amp;", "&").replace("&apos;", "'") : "",
        startDate: item.itemDtlMeta.startDate,
        endDate: item.itemDtlMeta.endDate,
        nights: getItemNightsFromMeta(item) || 1,
        hotelPaxInfo: [],
        noRooms: 1,
        rating: Number(item.itemDtlMeta.rating) || 0,
        uuid: item.itemDtlMeta.uuid || "",
        imgUrl: item.itemDtlMeta?.images?.find((x) => x.isDefault)?.url || "",
        dates: { checkInDate: item.itemDtlMeta.startDate, checkOutDate: item.itemDtlMeta.endDate } || "",
        day: 1,
        toDay: 1,
        details: item.itemDtlMeta,
        mealType: item.itemDtlMeta.mealType || "",
        hotelContactNumber: item.itemDtlMeta.hotelContactNumber || "",
        duration: item.itemDtlMeta.duration || "",
        itemType: (item.itemDtlMeta.roomName ? item.itemDtlMeta.roomName : item.itemDtlMeta.category) || "",
        otherType: "",
        guests: 1,
        taxType: item.itemDtlMeta?.taxType || "CGSTSGST",
        percentage: item.itemDtlMeta?.percentage || Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"),
        isTax1Modified: item.itemDtlEdit?.isTax1Modified || false,
        isTax2Modified: item.itemDtlEdit?.isTax2Modified || false,
        isTax3Modified: item.itemDtlEdit?.isTax3Modified || false,
        isTax4Modified: item.itemDtlEdit?.isTax4Modified || false,
        isTax5Modified: item.itemDtlEdit?.isTax5Modified || false,
      };
    }
  } else if (item.itemDtlEdit) {
    if (item.itemDtlEdit.business === "air") {
      return {
        business: item.itemDtlEdit.business || "",
        fromLocation: item.itemDtlEdit.fromLocation || "",
        fromLocationName: item.itemDtlEdit.fromLocationName || "",
        fromLocationCity: item.itemDtlEdit.fromLocationCity || "",
        toLocation: item.itemDtlEdit.toLocation || "",
        toLocationName: item.itemDtlEdit.toLocationName || "",
        toLocationCity: item.itemDtlEdit.toLocationCity || "",
        name: "",
        startDate: item.itemDtlEdit.startDate || "",
        endDate: item.itemDtlEdit.endDate || "",
        costPrice: item.itemDtlEdit.costPrice || "0",
        sellPrice: item.itemDtlEdit.sellPrice || "0",
        vendor: item.itemDtlEdit.vendor || "",
        brn: item.itemDtlEdit.brn || "",
        itemType: "",
        otherType: "",
        noRooms: "",
        rating: "",
        duration: "",
        guests: "",
        adult: (item.itemDtlEdit.adult === "0" ? 1 : item.itemDtlEdit.adult) || 1,
        child: item.itemDtlEdit.child || "",
        infant: item.itemDtlEdit.infant || "",
        pickupType: "",
        dropoffType: "",
        pickupTime: "",
        departStartDate: item.itemDtlEdit.departStartDate || "",
        departEndDate: item.itemDtlEdit.departEndDate || "",
        departStartTime: item.itemDtlEdit.departStartTime || "",
        departEndTime: item.itemDtlEdit.departEndTime || "",
        departAirlineName: item.itemDtlEdit.departAirlineName || "",
        departFlightNumber: item.itemDtlEdit.departFlightNumber || "",
        departClass: item.itemDtlEdit.departClass || "",
        departStops: item.itemDtlEdit.departStops || [],
        totaldepartDuration: item.itemDtlEdit.totaldepartDuration || "",
        departDuration: item.itemDtlEdit.departDuration || "",
        departImg: item.itemDtlEdit.departImg || "",
        returnStartDate: item.itemDtlEdit.returnStartDate || "",
        returnEndDate: item.itemDtlEdit.returnEndDate || "",
        returnStartTime: item.itemDtlEdit.returnStartTime || "",
        returnEndTime: item.itemDtlEdit.returnEndTime || "",
        returnAirlineName: item.itemDtlEdit.returnAirlineName || "",
        returnFlightNumber: item.itemDtlEdit.returnFlightNumber || "",
        returnClass: item.itemDtlEdit.returnClass || "",
        returnStops: item.itemDtlEdit.returnStops || [],
        totalreturnDuration: item.itemDtlEdit.totalreturnDuration || "",
        returnDuration: item.itemDtlEdit.returnDuration || "",
        returnImg: item.itemDtlEdit.returnImg || "",
        isRoundTrip: (item.itemDtlEdit?.isRoundTrip ? true : false) || "",
        uuid: item.itemDtlEdit.uuid || "",
        day: item.itemDtlEdit.day || 1,
        toDay: item.itemDtlEdit.toDay || 1,
        nights: item.itemDtlEdit.nights || 1,
        hotelPaxInfo: item.itemDtlEdit.hotelPaxInfo || [],
        dayDepart: item.itemDtlEdit.dayDepart || 1,
        dayDepartEnd: item.itemDtlEdit.dayDepartEnd || 1,
        dayReturn: item.itemDtlEdit.dayReturn || 1,
        dayReturnEnd: item.itemDtlEdit.dayReturnEnd || 1,
        dates: item.itemDtlEdit.dates || "",
        datesIsValid: item.itemDtlEdit.datesIsValid || "",
        cutOfDays: item.itemDtlEdit.cutOfDays || 7,
        stayInDays: item.itemDtlEdit.stayInDays || 7,
        description: item.itemDtlEdit.description || "",
        editMode: true,
        supplierCostPrice: item.itemDtlEdit?.supplierCostPrice || "",
        bookBefore: item.itemDtlEdit?.bookBefore || "",
        supplierTaxPrice: item.itemDtlEdit?.supplierTaxPrice || "",
        markupPrice: item.itemDtlEdit?.markupPrice || "",
        processingFees: item.itemDtlEdit?.processingFees || "",
        discountPrice: item.itemDtlEdit?.discountPrice || "",
        CGSTPrice: item.itemDtlEdit?.CGSTPrice || "",
        SGSTPrice: item.itemDtlEdit?.SGSTPrice || "",
        IGSTPrice: item.itemDtlEdit?.IGSTPrice || "",
        conversionRate: item.itemDtlEdit?.conversionRate || "",
        supplierCurrency: item.itemDtlEdit?.supplierCurrency || "",
        amountWithoutGST: item.itemDtlEdit?.amountWithoutGST || "",
        isInclusive: item.itemDtlEdit?.isInclusive || "",
        percentage: item.itemDtlEdit?.percentage || 0, //Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"),
        processingFees: item.itemDtlEdit?.processingFees || "",
        tax1: item.itemDtlEdit?.tax1 || "",
        tax2: item.itemDtlEdit?.tax2 || "",
        tax3: item.itemDtlEdit?.tax3 || "",
        tax4: item.itemDtlEdit?.tax4 || "",
        tax5: item.itemDtlEdit?.tax5 || "",
        isTax1Modified: item.itemDtlEdit?.isTax1Modified || false,
        isTax2Modified: item.itemDtlEdit?.isTax2Modified || false,
        isTax3Modified: item.itemDtlEdit?.isTax3Modified || false,
        isTax4Modified: item.itemDtlEdit?.isTax4Modified || false,
        isTax5Modified: item.itemDtlEdit?.isTax5Modified || false,
        taxType: item.itemDtlEdit?.taxType || "CGSTSGST",
      };
    }
    else {
      let itemtype = "";
      if (item.itemDtlEdit.business === "custom" && item.itemDtlEdit.customitemType !== "") {
        if (item.itemDtlEdit.customitemType && item.itemDtlEdit.customitemType.toLowerCase() === "other" && item.itemDtlEdit.otherType !== "") {
          itemtype = item.itemDtlEdit?.otherType;
        }
        if (item.itemDtlEdit.customitemType && item.itemDtlEdit.customitemType.toLowerCase() !== "other") {
          itemtype = item.itemDtlEdit?.customitemType;
        }
      }
      return {

        business: item.itemDtlEdit.business || "",
        fromLocation: item.itemDtlEdit.fromLocation || "",
        fromLocationName: item.itemDtlEdit.name || "",
        fromLocationCity: item.itemDtlEdit.city || "",
        toLocation: item.itemDtlEdit.toLocation || "",
        toLocationName: item.itemDtlEdit.name || "",
        toLocationCity: item.itemDtlEdit.toLocationCity || "",
        name: item.itemDtlEdit.name ? item.itemDtlEdit.name.replace("&amp;", "&").replace("&apos;", "'") : "",
        startDate: item.itemDtlEdit.startDate || "",
        endDate: item.itemDtlEdit.endDate || "",
        nights: item.itemDtlEdit.nights || 1,
        hotelPaxInfo: item.itemDtlEdit.hotelPaxInfo || [],
        noRooms: item.itemDtlEdit.noRooms || 1,
        rating: Number(item.itemDtlEdit.rating) || 0,
        dates: { checkInDate: item.itemDtlEdit.startDate, checkOutDate: item.itemDtlEdit.endDate } || "",
        uuid: item.itemDtlEdit.uuid || "",
        imgUrl: item.itemDtlEdit?.imgUrl || "",
        day: item.itemDtlEdit.day || 1,
        toDay: item.itemDtlEdit.toDay || 1,
        itemType: (itemtype ? itemtype : item.itemDtlEdit?.itemType) || "",
        otherType: item.itemDtlEdit?.otherType || "",
        costPrice: item.itemDtlEdit?.costPrice || "0",
        sellPrice: item.itemDtlEdit?.sellPrice || "0",
        details: item.itemDtlEdit.details,
        vendor: item.itemDtlEdit.vendor || "",
        brn: item.itemDtlEdit.brn || "",
        supplierCurrency: item.itemDtlEdit.supplierCurrency || "",
        conversionRate: item.itemDtlEdit.conversionRate || "",
        bookBefore: item.itemDtlEdit.bookBefore || "",
        description: item.itemDtlEdit.description || "",
        duration: item.itemDtlEdit.duration,
        guests: item.itemDtlEdit.guests,
        editMode: true,
        pickupTime: item.itemDtlEdit.pickupTime || "",
        supplierCostPrice: item.itemDtlEdit?.supplierCostPrice || "",
        uuid: item.itemDtlEdit.uuid || "",
        mealType: item.itemDtlEdit.mealType || "",
        hotelContactNumber: item.itemDtlEdit.hotelContactNumber || "",
        supplierTaxPrice: item.itemDtlEdit?.supplierTaxPrice || "",
        markupPrice: item.itemDtlEdit?.markupPrice || "",
        processingFees: item.itemDtlEdit?.processingFees || "",
        discountPrice: item.itemDtlEdit?.discountPrice || "",
        CGSTPrice: item.itemDtlEdit?.CGSTPrice || "",
        SGSTPrice: item.itemDtlEdit?.SGSTPrice || "",
        IGSTPrice: item.itemDtlEdit?.IGSTPrice || "",
        ImageUrl: item.itemDtlEdit?.ImageUrl || "",
        ImageName: item.itemDtlEdit?.ImageName || "",
        ImgExtension: item.itemDtlEdit?.ImgExtension || "",
        amountWithoutGST: item.itemDtlEdit?.amountWithoutGST || "",
        isInclusive: item.itemDtlEdit?.isInclusive || "",
        percentage: item.itemDtlEdit?.percentage || 0, //Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")
        processingFees: item.itemDtlEdit?.processingFees || "",
        tax1: item.itemDtlEdit?.tax1 || "",
        tax2: item.itemDtlEdit?.tax2 || "",
        tax3: item.itemDtlEdit?.tax3 || "",
        tax4: item.itemDtlEdit?.tax4 || "",
        tax5: item.itemDtlEdit?.tax5 || "",
        isTax1Modified: item.itemDtlEdit?.isTax1Modified || false,
        isTax2Modified: item.itemDtlEdit?.isTax2Modified || false,
        isTax3Modified: item.itemDtlEdit?.isTax3Modified || false,
        isTax4Modified: item.itemDtlEdit?.isTax4Modified || false,
        isTax5Modified: item.itemDtlEdit?.isTax5Modified || false,
        taxType: item.itemDtlEdit?.taxType || "CGSTSGST",
      };
    }
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
    } else {
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
        return item.itemDtl.items.find((x) => x.id === item.roomId).item.map((room) => room.name);
      } else {
        let itemTypes = "";
        item.roomId.map((room) => {
          let itemType = item.itemDtl.items
            .find((x) => x.id === room.groupid)
            .item.find((y) => y.code === room.roomCode).name;
          itemTypes = itemTypes + itemType;
        });
        return itemTypes;
      }
    } else {
      let returnData = [...item.itemDtl.items.map(
        (x) =>
          x.item.find((y) => y.id === item.roomId) && x.item.find((y) => y.id === item.roomId).name
      )].filter(Boolean);
      return returnData[0];
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

const getItemNightsFromMeta = (item) => {
  let nights = moment(item.itemDtlMeta.endDate).diff(moment(item.itemDtlMeta.startDate), "days");
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
