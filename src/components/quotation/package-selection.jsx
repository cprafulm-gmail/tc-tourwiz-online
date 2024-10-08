import React, { Component } from 'react'
import Form from '../common/form'
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import Adult from "../../assets/images/men-svgrepo-com.svg";
import Child from "../../assets/images/child-svgrepo-com.svg";
import Infant from "../../assets/images/baby-icon.svg";
import Loader from '../common/loader';
import Amount from '../../helpers/amount';
import { scroller } from "react-scroll";

class PackageSelection extends Form {

	state = {
		packagelist: [
			{ name: "Single Occupancy", roomName: "Single Room", price: 0, code: "SI", maxAdult: 1, maxChild: 1, originalprice: 0, extraBed: 0, mapperName: "Single Adult" },
			{ name: "Twin Sharing", roomName: "Twin Room", price: 0, code: "TW", maxAdult: 2, maxChild: 2, originalprice: 0, extraBed: 1, mapperName: "Per Adult" },
			{ name: "Triple Sharing", roomName: "Triple Room", price: 0, code: "TR", maxAdult: 3, maxChild: 0, originalprice: 0, extraBed: 0, mapperName: "" },
			{ name: "Child With Bed", roomName: "Child With Bed", price: 0, code: "CB", childCount: 1, originalprice: 0, mapperName: "Per Child" },
			{ name: "Child Without Bed", roomName: "Child Without Bed", price: 0, code: "CWB", childCount: 2, originalprice: 0, mapperName: "Extra Child WithoutBed" },
			{ name: "Infant", roomName: "Infant", price: 0, code: "IN", originalprice: 0, mapperName: "Per Infant" },
		],

		adult: 0,
		child: 0,
		infant: 0,
		total: 0,
		options: [],
		maxCount: 6,
		error: "",
		room: 0,
		totalPrice: 0,
		selectedOption: "",
		isShowPaxSection: true,
		stopInfo: [],
		selectedStopInfo: "",
		stopAdditionalAmount: 0,
		selectedStopInfoReqData: []
	}
	handlePaxClick = (action, type) => {
		let adultCount = this.state.adult;
		let childCount = this.state.child;
		let infantCount = this.state.infant;

		if (type === "adult") {
			adultCount = action === "+" ? this.state.adult + 1 : this.state.adult - 1;
			this.setState({ adult: adultCount });
		}
		else if (type === "child") {
			childCount = action === "+" ? this.state.child + 1 : this.state.child - 1;
			this.setState({ child: childCount });
		}
		else if (type === "infant") {
			infantCount = action === "+" ? this.state.infant + 1 : this.state.infant - 1;
			this.setState({ infant: infantCount });
		}
		this.setState({ total: adultCount + childCount + infantCount });
		this.generateRooms(adultCount, childCount, infantCount);
	};
	generateRooms = (adult, child, infant) => {
		this.state.error = "";
		let rooms = [
			{ name: "g1", value: [] },
			{ name: "g2", value: [] },
			{ name: "g3", value: [] },
			{ name: "g4", value: [] },
		];
		// Single Room
		if (adult > 0) {
			rooms.find((x) => x.name === "g1").value.push({ name: "SI", value: [1] });
			if (child > 0) {
				rooms.find((x) => x.name === "g1").value.push({ name: "CWB", value: [child] });
			}
			if (infant > 0) {
				rooms.find((x) => x.name === "g1").value.push({ name: "IN", value: [infant] });
			}
		}
		// Twin Room
		if (adult > 1) {
			// 2,4,6 Adult == Twin Rooms
			if (adult % 2 === 0) {
				rooms.find((x) => x.name === "g2").value.push({ name: "TW", value: [parseInt(adult / 2)] });
				if (child > 0) {
					if (child == 1) {
						rooms.find((x) => x.name === "g2").value.push({ name: "CB", value: [1] });
					}
					else {
						rooms.find((x) => x.name === "g2").value.push({ name: "CB", value: [1] });
						rooms.find((x) => x.name === "g2").value.push({ name: "CWB", value: [1] });
					}
				}
				// 4 Adult == 1 Twin Room & 2 Single Room
				if (adult == 4 && child == 0) {
					rooms.find((x) => x.name === "g4").value.push({ name: "TW", value: [1] });
					rooms.find((x) => x.name === "g4").value.push({ name: "SI", value: [2] });
				}
				// Infant Case
				if (infant > 0)
					rooms.find((x) => x.name === "g2").value.push({ name: "IN", value: [infant] });
			}
			// 3 OR 5 Adult == 1 Twin + 1 Single
			else if (adult % 2 === 1) {
				rooms.find((x) => x.name === "g2").value.push({ name: "TW", value: [parseInt(adult / 2)] });
				if (child > 0) {
					if (child == 2) {
						rooms.find((x) => x.name === "g2").value.push({ name: "CB", value: [child / 2] });
						rooms.find((x) => x.name === "g2").value.push({ name: "CWB", value: [child / 2] });
					}
					if (child == 3) {
						rooms.find((x) => x.name === "g2").value.push({ name: "CB", value: [child - 2] });
						rooms.find((x) => x.name === "g2").value.push({ name: "CWB", value: [child - 1] });
					}
				}
				rooms.find((x) => x.name === "g2").value.push({ name: "SI", value: [parseInt(adult % 2)] });
				// Infant Case
				if (infant > 0)
					rooms.find((x) => x.name === "g2").value.push({ name: "IN", value: [infant] });
			}
		}
		// Child With Out Bed Option
		if (adult > 1 && child > 0) {
			if (adult % 2 === 0) {
				rooms.find((x) => x.name === "g4").value.push({ name: "TW", value: [parseInt(adult / 2)] });
				if (child > 0)
					rooms.find((x) => x.name === "g4").value.push({ name: "CWB", value: [child] });
				if (infant > 0)
					rooms.find((x) => x.name === "g4").value.push({ name: "IN", value: [infant] });
			}
			else if (adult % 2 === 1) {
				rooms.find((x) => x.name === "g4").value.push({ name: "TW", value: [parseInt(adult / 2)] });
				if (child > 0)
					rooms.find((x) => x.name === "g4").value.push({ name: "CWB", value: [child] });
				rooms.find((x) => x.name === "g4").value.push({ name: "SI", value: [parseInt(adult % 2)] });
				// Infant Case
				if (infant > 0)
					rooms.find((x) => x.name === "g4").value.push({ name: "IN", value: [infant] });
			}
		}
		// Triple Room
		if (adult > 2) {
			// 3,6 Adult = Triple Room
			if (adult % 3 === 0) {
				rooms.find((x) => x.name === "g3").value.push({ name: "TR", value: [parseInt(adult / 3)] });
				if (child > 0)
					rooms.find((x) => x.name === "g3").value.push({ name: "CWB", value: [parseInt(child / 1)] });
				if (infant > 0)
					rooms.find((x) => x.name === "g3").value.push({ name: "IN", value: [infant] });
			}
			// 4 Adult = 1 Triple Room + 1 Single Room
			else if (adult % 3 === 1) {
				rooms.find((x) => x.name === "g3").value.push({ name: "TR", value: [parseInt(adult / 3)] });
				if (child > 0) {
					rooms.find((x) => x.name === "g3").value.push({ name: "CWB", value: [child] })
				}
				rooms.find((x) => x.name === "g3").value.push({ name: "SI", value: [parseInt(adult / 3)] });
				if (infant > 0) {
					rooms.find((x) => x.name === "g3").value.push({ name: "IN", value: [infant] });
				}
			}
			// 5 Adult = 1 Triple Room + 1 Twin
			else if (adult % 3 === 2) {
				rooms.find((x) => x.name === "g3").value.push({ name: "TR", value: [parseInt(adult / 3)] });
				if (child > 0) {
					rooms.find((x) => x.name === "g3").value.push({ name: "CWB", value: [child] });
				}
				rooms.find((x) => x.name === "g3").value.push({ name: "TW", value: [parseInt(adult / 3)] });
				if (infant > 0)
					rooms.find((x) => x.name === "g3").value.push({ name: "IN", value: [infant] });
			}
		}
		this.generateOptions(rooms, adult, child, infant);
	};
	generateOptions = (rooms, adult, child, infant) => {
		let packagelist = this.state.packagelist;
		let options = [];
		let siCount = 0;
		let twCount = 0;
		let trCount = 0;
		rooms.map((x) => {

			switch (x["name"]) {
				case "g1":
					var g1 = rooms[0].value.map(x => {
						x.value = Array.isArray(x.value) ? x.value.reduce((a, b) => a += b, 0) : x.value;
						if (x.name === "SI") {
							if (adult > 1) {
								//return adult + " Single Room - " + x.value + " Adults in Each room";
								return {
									name: adult + " Single Room - " + x.value + " Adults in Each room",
									mapperData: [{
										mapperName: packagelist.find(y => y.code === x.name).mapperName,
										mapperValue: adult
									}],
								};
							}
							//return adult + " Single Room - " + x.value + " Adult";
							return {
								name: adult + " Single Room - " + x.value + " Adult",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: adult
								}]
							};
						}
						else if (x.name === "CWB") {
							//return child + " Child Without Bed ";
							return {
								name: child + " Child Without Bed ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: child
								}]
							};
						}
						else if (x.name === "IN") {
							//return infant + " Infant ";
							return {
								name: infant + " Infant ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: infant
								}]
							};
						}
					});

					let g1_tmp = g1.map(x => x.name);
					options.push({
						option: g1_tmp.join(' + '),
						mapperData: g1.map(x => x.mapperData).flatMap(num => num)
					});
					break;
				case "g2":
					var g2 = rooms[1].value.map(x => {
						x.value = Array.isArray(x.value) ? x.value.reduce((a, b) => a += b, 0) : x.value;
						if (x.name === "TW") {
							//return x.value + " Twin Room - " + x.value * 2 + " Adult";
							return {
								name: x.value + " Twin Room - " + x.value * 2 + " Adult",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value * 2
								}]
							};
						}
						else if (x.name === "CB") {
							//if (child > 1) { return x.value + " Child With Bed" }
							//return x.value + " Child With Bed ";
							return {
								name: x.value + " Child With Bed ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "CWB") {
							//if (child > 1) { return x.value + " Child With Out Bed" }
							//return child + " Child Without Bed ";
							return {
								name: x.value + " Child With Out Bed",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: child > 1 ? x.value : child
								}]
							};
						}
						else if (x.name === "SI") {
							//return x.value + " Single Room - " + x.value * 1 + " Adults in Each room";
							return {
								name: x.value + " Single Room - " + x.value * 1 + " Adults in Each room",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "IN") {
							//return infant + " Infant ";
							return {
								name: infant + " Infant ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: infant
								}]
							};
						}
					});
					let g2_tmp = g2.map(x => x.name);
					options.push({
						option: g2_tmp.join(' + '),
						mapperData: g2.map(x => x.mapperData).flatMap(num => num)
					});
					break;
				case "g3":
					var g3 = rooms[2].value.map(x => {
						x.value = Array.isArray(x.value) ? x.value.reduce((a, b) => a += b, 0) : x.value;
						if (x.name === "TR") {
							//return x.value + " Triple Room - " + x.value * 3 + " Adult";
							return {
								name: x.value + " Triple Room - " + x.value * 3 + " Adult",
								mapperData: [{
									mapperName: "Extra Adult",
									mapperValue: 1 * x.value
								},
								{
									mapperName: "Per Adult",
									mapperValue: 2 * x.value
								}]
							};
						}
						else if (x.name === "TW") {
							//return x.value + " Twin Room - " + x.value * 2 + " Adult";
							return {
								name: x.value + " Twin Room - " + x.value * 2 + " Adult",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value * 2
								}]
							};
						}
						else if (x.name === "SI") {
							//return x.value + " Single Room - " + x.value * 1 + " Adult in Each room";
							return {
								name: x.value + " Single Room - " + x.value * 1 + " Adult in Each room",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "CWB") {
							//if (child > 1) { return x.value + " Child Without Bed" + "( 1 Child In Each Room )" }
							//return x.value + " Child Without Bed ";
							return {
								name: child > 1
									? x.value + " Child Without Bed" + "( 1 Child In Each Room )"
									: x.value + " Child Without Bed ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "IN") {
							//return infant + " Infant ";
							return {
								name: infant + " Infant ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: infant
								}]
							};
						}
					})
					let g3_tmp = g3.map(x => x.name);
					options.push({
						option: g3_tmp.join(' + '),
						mapperData: g3.map(x => x.mapperData).flatMap(num => num)
					});
					break;
				case "g4":
					var g4 = rooms[3].value.map(x => {
						x.value = Array.isArray(x.value) ? x.value.reduce((a, b) => a += b, 0) : x.value;
						if (x.name === "TW") {
							//return x.value + " Twin Room - " + x.value * 2 + " Adult";
							return {
								name: x.value + " Twin Room - " + x.value * 2 + " Adult",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value * 2
								}]
							};
						}
						else if (x.name === "CWB") {
							//if (child > 1) { return x.value + " Child Without Bed" + "( 1 Child In Each Room )" }
							//return x.value + " Child Without Bed ";
							return {
								name: child > 1
									? x.value + " Child Without Bed" + "( 1 Child In Each Room )"
									: x.value + " Child Without Bed ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "SI") {
							//return x.value + " Single Room - " + x.value * 1 + " Adults in Each room";
							return {
								name: x.value + " Single Room - " + x.value * 1 + " Adults in Each room",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: x.value
								}]
							};
						}
						else if (x.name === "IN") {
							//return infant + " Infant ";
							return {
								name: infant + " Infant ",
								mapperData: [{
									mapperName: packagelist.find(y => y.code === x.name).mapperName,
									mapperValue: infant
								}]
							};
						}
					})
					let g4_tmp = g4.map(x => x.name);
					options.push({
						option: g4_tmp.join(' + '),
						mapperData: g4.map(x => x.mapperData).flatMap(num => num)
					});
					break;

				default:
					break;
			}
		});
		this.setState({ options, selectedOption: options[0] }, () => { this.changePackage(options[0].option) });
	};
	handleRedirect = (req, redirect) => {
		if (redirect) {
			if (redirect === "back-office")
				this.props.history.push(`/Backoffice/${req}`);
			else {
				this.props.history.push(`/Reports`);
			}
			//window.location.reload();
		} else {
			this.props.history.push(`${req}`);
		}
	};
	changePackage = (value) => {
		var PackagePrice = [];
		var Room = [];
		if (value.includes('+') === true) {
			let temp = value.split('+');
			temp.map(a1 => this.state.packagelist.map(item => {

				if (a1.includes(item.roomName) === true) {
					var room = parseInt(a1.split(this.state.roomSeparator)[0]);
					var price = room * item.originalprice;
					if (a1.includes('Child') || a1.includes('Infant')) {
						Room.push(0);
					}
					else {
						Room.push(room);
					}
					return PackagePrice.push(price);
				}
			}));
		}
		else {
			this.state.packagelist.map(item => {
				if (value.includes(item.roomName) === true) {
					var room = parseInt(value.split(this.state.roomSeparator)[0]);
					var price = room * item.originalprice;
					Room.push(room);
					return PackagePrice.push(price);
				}
			})
		}
		var count = 0;
		var roomcount = 0;
		for (let sum of PackagePrice) { count = count + sum; }
		for (let sumofroom of Room) { roomcount = roomcount + sumofroom; }
		this.setState({ totalPrice: count, room: roomcount, selectedOption: value });
	}
	handlePaxSection = () => {
		this.setState({
			isShowPaxSection: !this.state.isShowPaxSection,
			selectedStopInfo: this.state.stopInfo.find(x => x.isDefault).value,
			stopAdditionalAmount: 0,
			selectedStopInfoReqData: [],
		}, () => {
			scroller.scrollTo("stopInfoForScroll", {
				duration: 500,
				delay: 0,
				smooth: "easeInOutQuart",
				offset: -150
			});
		});
	}
	handleStopInfo = (locationID) => {
		var rateLookup = this.props.items[0].item[0].displayRateInfo;
		let adult_price = parseInt(rateLookup.find(x => x.description === locationID + "_ADULT")?.amount ?? 0);
		let child_price = parseInt(rateLookup.find(x => x.description === locationID + "_CHILD")?.amount ?? 0);
		let infant_price = parseInt(rateLookup.find(x => x.description === locationID + "_INFANT")?.amount ?? 0);
		let { selectedStopInfo, options, selectedOption } = this.state
		let selectedStopInfoReqData = [];
		var paxWiseAmount = options.find(x => x.option === selectedOption).mapperData.map(item => {
			if (item.mapperName.toLowerCase().indexOf("adult") > -1) {
				selectedStopInfoReqData.push({
					mapperName: locationID + "_ADULT",
					mapperValue: item.mapperValue
				});
				return item.mapperValue * adult_price;
			}
			else if (item.mapperName.toLowerCase().indexOf("child") > -1) {
				selectedStopInfoReqData.push({
					mapperName: locationID + "_CHILD",
					mapperValue: item.mapperValue
				});
				return item.mapperValue * child_price;
			}
			else if (item.mapperName.toLowerCase().indexOf("infant") > -1) {
				selectedStopInfoReqData.push({
					mapperName: locationID + "_INFANT",
					mapperValue: item.mapperValue
				});
				return item.mapperValue * infant_price;
			}
		});
		let stopAdditionalAmount = paxWiseAmount.reduce((a, b) => a + b, 0);

		this.setState({ selectedStopInfo: locationID, stopAdditionalAmount, selectedStopInfoReqData });
	}
	handleBookNow = () => {
		let reqKey = this.props.id;
		let reqValue = this.props.items[0].item[0].id

		let { options, selectedOption, selectedStopInfoReqData } = this.state;
		let activityUnits = options.find(x => selectedOption === x.option)?.mapperData
			.map(y => {
				return { "Description": y.mapperName, "quantity": y.mapperValue }
			});
		let activityUnits1 = selectedStopInfoReqData.map(y => {
			return { "Description": y.mapperName, "quantity": y.mapperValue }
		});
		activityUnits1 = activityUnits1.reduce((prev, curr) => {
			if (prev[curr.Description]) {
				prev[curr.Description].quantity = parseInt([prev[curr.Description].quantity + curr.quantity].join(','))
			} else {
				prev[curr.Description] = curr
			}
			return prev
		}, {})

		/* 	
		.map(y => { return <li>{y.mapperName + " - " + y.mapperValue */

		this.props.handleCart(reqKey, reqValue, '', false, undefined, { name: options.find(x => x.option === selectedOption), options: activityUnits.concat(activityUnits1) });
	}
	componentDidMount() {
		let stopInfo = [];
		let selectedStopInfo = "";
		if (this.props.stopInfo.length > 0) {
			var resStopInfo = this.props.stopInfo[0].item;
			stopInfo = resStopInfo.map(item => {
				if (item.isPackageCity)
					selectedStopInfo = item.id;
				return {
					name: item.city + ", " + item.state + ", " + item.country,
					value: item.id,
					isDefault: item.isPackageCity
				}
			})
		}

		let packagelist = [];
		let totalPrice = 0;

		packagelist = this.state.packagelist;
		packagelist = packagelist.map(item => {
			var rateLookup = this.props.items[0].item[0].displayRateInfo;
			if (item.name === "Twin Sharing") {
				item.price = parseInt(rateLookup.find(x => x.description === item.mapperName).amount) * 2;
			}
			else if (item.mapperName === "" && item.name === "Triple Sharing") {
				var a = parseInt(rateLookup.find(x => x.description === "Extra Adult").amount);
				var b = parseInt(rateLookup.find(x => x.description === "Per Adult").amount) * 2;
				item.price = a + b;
			}
			else
				item.price = parseInt(rateLookup.find(x => x.description === item.mapperName).amount);
			item.originalprice = item.price;
			return item;
		});

		this.setState({ stopInfo, selectedStopInfo, packagelist: packagelist, totalPrice: totalPrice });
		this.handlePaxClick('+', "adult");
		//this.changePackage(this.state.options[0].option);
	}
	render() {
		const { isShowPaxSection,
			stopInfo,
			selectedStopInfo,
			selectedOption,
			options,
			selectedStopInfoReqData,
			totalPrice,
			stopAdditionalAmount } = this.state
		return (
			<div className="agent-dashboard">
				<React.Fragment>
					<div className='container'>
						<div className='row'>
							{/* <div className="col-lg-3 hideMenu">
								<QuotationMenu handleMenuClick={this.handleRedirect} userInfo={this.props.userInfo} {...this.props} />
							</div> */}
							{isShowPaxSection && <React.Fragment>
								<div className='col-lg-6 mt-3 '>
									<div className='row'>
										<h5 className='col-12 mb-0'><b>Guest & Rooms</b></h5>
										<small className='col-12 '>(Maximum 6 guests at a time)</small>
									</div>
									<div className="col-12 mt-2">
										<div className='row'>
											<div className='col-sm-1 mb-2'>
												<img
													style={{ filter: "none", height: "24px" }}
													src={Adult}
													alt=""
												/>
											</div>
											<div className='col-sm-6'>
												<b>Adult</b>

											</div>
										</div>
										<ul className="pagination">
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="adult" onClick={() => this.handlePaxClick("-", "adult")}
													disabled={this.state.adult < 2}
												>-
												</button>
											</li>
											<li className="page-item">
												<span className="page-link bg-light">{this.state.adult}</span>
											</li>
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="adult" onClick={() => this.handlePaxClick("+", "adult")}
													disabled={this.state.total > this.state.maxCount - 1}
												>+
												</button>
											</li>
										</ul>
									</div>

									<div className="col-12 mt-2">
										<div className='row'>
											<div className='col-sm-1 mb-2'>
												<img
													style={{ filter: "none", height: "24px" }}
													src={Child}
													alt=""
												/>
											</div>
											<div className='col-sm-6'>
												<b>Child</b>
											</div>
										</div>
										<ul className="pagination">
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="child" onClick={() => this.handlePaxClick("-", "child")}
													disabled={this.state.child < 1}
												>-
												</button>
											</li>
											<li className="page-item">
												<span className="page-link bg-light">{this.state.child}</span>
											</li>
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="child" onClick={() => this.handlePaxClick("+", "child")}
													disabled={this.state.total > this.state.maxCount - 1 || this.state.child >= this.state.adult}
												>+
												</button>
											</li>
										</ul>
									</div>

									<div className="col-12 mt-2 mb-3">
										<div className='row'>
											<div className='col-sm-1 mb-2'>
												<img
													style={{ filter: "none", height: "24px" }}
													src={Infant}
													alt=""
												/>
											</div>
											<div className='col-sm-6'>
												<b>Infant</b>
											</div>
										</div>
										<ul className="pagination">
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="infant" onClick={() => this.handlePaxClick("-", "infant")}
													disabled={this.state.infant < 1}
												>-
												</button>
											</li>
											<li className="page-item">
												<span className="page-link bg-light">{this.state.infant}</span>
											</li>
											<li className="page-item">
												<button
													className="page-link font-weight-bold" name="infant" onClick={() => this.handlePaxClick("+", "infant")}
													disabled={this.state.total > this.state.maxCount - 1 || this.state.infant >= this.state.adult}
												>+
												</button>
											</li>
										</ul>
									</div>
									{this.state.error !== "" &&
										<small className="alert alert-danger p-1 d-inline-block ml-3">
											{this.state.error}
										</small>
									}
									{this.state.options !== null && this.state.options.map((x) => {
										return x.option !== '' ?
											<div className="mb-2">
												<input type='radio'
													name="option"
													value={x.option}
													checked={this.state.selectedOption === x.option}
													onClick={() => this.changePackage(x.option)}>
												</input>
												<span className='ml-2'>{x.option}</span>
											</div>
											: ""
									})}
								</div>
								<div className='col-lg-6 mt-3 mb-3'>
									<h5><b>Details Room Price</b></h5>
									<div className="border mt-2">
										<div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
											<div className='row'>
												<div className="row quotation-list-grid-header">
													<div className="col-lg-12">
														<div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
															<div className="row">
																<div className="col-lg-6">
																	<b>Room Type</b>
																</div>
																<div className="col-lg-6">
																	<b>Basic Price</b>
																</div>
															</div>
														</div>
													</div>
													{this.state.packagelist.map((item, key, arr) => {
														return (
															<div className="col-lg-12">
																<div
																	key={key}
																	className={"pl-3 pr-3 pt-3 position-relative" + (arr.length === key + 1 ? "" : " border-bottom")}
																>
																	<div className="row quotation-list-item">
																		<div className="col-lg-6 d-flex align-items-center pb-3">
																			<div>
																				<span>
																					{item.name}
																				</span>
																			</div>
																		</div>
																		<div className="col-lg-6 d-flex align-items-center pb-3">
																			<div>
																				<span>
																					<Amount amount={item.price} />
																				</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														)
													})}
												</div>
											</div>
										</div>
									</div>
								</div>
							</React.Fragment>}
							{!isShowPaxSection && <React.Fragment>
								<div className='col-lg-12 mt-3 mb-3'>

									<label htmlFor="stopInfo" name="stopInfoForScroll" className='font-weight-bold h5'>Departure City</label>
									<select
										className={"form-control"}
										onChange={(e) => this.handleStopInfo(e.target.value)}
										defaultValue={selectedStopInfo}
									>
										{stopInfo.map((route) => {
											return (
												<option key={route.value} value={route.value}>
													{route.name}
												</option>
											);
										})}
									</select>

								</div>
							</React.Fragment>}
							<div className='col-lg-12 mt-3 mb-3'>
								<div className="row">
									<div className="col-lg-8">
										<h6 className="pt-2">{this.state.adult} Adults | {this.state.child} Child | {this.state.infant} Infant | {this.state.room} Room </h6>
									</div>
									<div className="col-lg-4">
										<button type="button" class="btn btn-link pull-right text-primary" onClick={this.handlePaxSection}>
											<SVGIcon
												name={!isShowPaxSection ? "pencil" : "yes"}
												width="16"
												height="16"
												type={!isShowPaxSection ? "lineal" : "fill"}
												className="mr-2"
											></SVGIcon>
											<span>
												{isShowPaxSection ? "Done" : "Modify"}
											</span>
										</button>
									</div>
								</div>
								<div className="row">
									<h5 className='col-lg-6 mt-4'>
										<b>Total</b> : <Amount amount={totalPrice + stopAdditionalAmount} />
									</h5>

									<div className='col-lg-6 mt-4'>
										{this.props.isBtnLoading ?
											<button type="button" class="btn btn-primary pull-right " >
												<span className="spinner-border spinner-border-sm mr-2"></span>
												Book Now
											</button>
											: <button type="button" class="btn btn-primary pull-right " onClick={this.handleBookNow}>
												Book Now
											</button>
										}
									</div>

									{/* <div className='col-lg-12 mt-5'>
										<ul>
											{options &&
												options.find(x => selectedOption === x.option)?.mapperData
													.map(y => { return <li>{y.mapperName + " - " + y.mapperValue}</li> })}
										</ul>
										<ul>
											{selectedStopInfoReqData && selectedStopInfoReqData
												.map(y => { return <li>{y.mapperName + " - " + y.mapperValue}</li> })}
										</ul>

									</div> */}
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			</div>)
	}
}
export default PackageSelection;