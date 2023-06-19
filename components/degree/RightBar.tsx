import { useEffect, useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import { SIDEBAR } from "../../types/SideBar";
import { Tab, RadioGroup } from "@headlessui/react";
import { CheckIcon, Search, XMarkIcon } from "../icons";
import { Edge, MarkerType } from "reactflow";
import { removeCourse, setSelected } from "../../utils/bridge";
import useSupabase from "../../hooks/useSupabase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const level: { [key: string]: { label: string; color: string } } = {
	1: {
		label: "Introductory",
		color: "-blue-600",
	},
	2: {
		label: "Intermediate",
		color: "-green-600",
	},
	3: {
		label: "Advanced",
		color: "-red-600",
	},
	4: {
		label: "Expert",
		color: "-purple-600",
	},
};

const RightBar = () => {
	const { supabase } = useSupabase();
	const { id } = useRouter().query;
	const {
		sideBar,
		setSideBar,
		setUsed,
		map,
		setMap,
		infoCourse,
		used,
		setInfoCourse,
		setNodes,
		setEdges,
		req,
		info,
	} = useCourses();
	const [index, setIndex] = useState(0);
	const [levelIndex, setLevelIndex] = useState("1");
	const [changing, setChanging] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState<{
		course: string;
		name: string;
		selected: boolean;
		color: string;
		desc: string;
	}>({
		course: "",
		name: "",
		selected: false,
		color: "",
		desc: "",
	});
	const show = sideBar === SIDEBAR.INFO;

	const keys = Object.keys(info);
	useEffect(() => {
		// console.log("Keys", keys);
		// for (const key in info) {
		// 	if (key === infoCourse.id) {
		// 		setInfoCourse({ ...infoCourse, description: info[key].desc });
		// 		console.log(infoCourse.description);
		// 	}
		// }
		// console.log("Info", infoCourse);
		// console.log("Info", info["MTH 2320"]);
		setLevelIndex(infoCourse.id.charAt(4));
		if (infoCourse.children) {
			setIndex(1);

			setSelectedCourse(
				infoCourse.children.find((child) => child.selected) || {
					course: "",
					name: "",
					selected: false,
					color: "",
					desc: "",
				}
			);
			return;
		}
		setIndex(0);
	}, [infoCourse]);
	// const lev = infoCourse.id.charAt(4);
	// check if one of the nodes of type "selectorNode" has any child that is selected
	// const selected = nodes.some((node) => node.type === "selectorNode" && (node.data.children as { code: string, selected: boolean }[]).some((child) => child.selected));
	const selected =
		!infoCourse.children ||
		infoCourse.children.some((child) => child.selected);

	const handleChange = async (e: {
		course: string;
		name: string;
		selected: boolean;
		color: string;
		desc: string;
	}) => {
		if (changing) {
			return;
		}
		setChanging(true);

		// FIXME: could be more efficient by not relying on the Node's data and using the wrapper's state instead (check if this causes a re-render)
		setNodes((nodes) => {
			return nodes.map((node) => {
				if (node.id === infoCourse.id) {
					return {
						...node,
						data: {
							...node.data,
							children: node.data.children?.map(
								(child: {
									course: string;
									selected: boolean;
								}) => {
									if (child.course === e.course) {
										return {
											...child,
											selected: true,
										};
									}
									return {
										...child,
										selected: false,
									};
								}
							),
						},
					};
				}
				return node;
			});
		});
		setEdges((edges) => {
			return [
				...(edges
					.map((edge) => {
						if (edge.target === infoCourse.id) {
							return undefined;
						}
						return edge;
					})
					.filter((edge) => edge !== undefined) as Edge[]),
				...(req[e.course]
					? req[e.course].map((requisite) => {
							return {
								id: `${e.course} -> ${requisite}`,
								source: requisite,
								sourceHandle: `${requisite}right`,
								target: infoCourse.id,
								targetHandle: `${infoCourse.id}tarTop`,
								type: "smoothstep",
								animated: false,
								markerEnd: {
									type: MarkerType.ArrowClosed,
									color: e.color,
									width: 20,
									height: 20,
									strokeWidth: 0,
								},
								style: {
									stroke: e.color,
									strokeWidth: 2,
								},
							};
					  })
					: []),
			];
		});
		setSelectedCourse({
			...e,
			selected: true,
		});

		setInfoCourse({
			...infoCourse,
			children: infoCourse.children?.map((child) => {
				if (child.course === e.course) {
					return {
						...child,
						selected: true,
					};
				}
				return {
					...child,
					selected: false,
				};
			}),
		});
		if (used[selectedCourse.course] !== undefined) {
			let termId = "";
			// FIXME: could be more efficient
			map.forEach((courses, term) => {
				if (courses.includes(selectedCourse.course)) {
					termId = term;
				}
			});
			const { data, error } = termId
				? await removeCourse(termId, selectedCourse.course, supabase)
				: { data: null, error: 1 };

			if (error) {
				toast.error("Error removing course");
				return;
			} else {
				setUsed((used) => {
					delete used[selectedCourse.course];
					return used;
				});
				setMap((map) => {
					const courses = map.get(termId) as string[];
					const mapi = new Map(
						map.set(
							termId,
							courses.filter(
								(course) => course !== selectedCourse.course
							)
						)
					);

					return mapi;
				});
			}
		}
		const { data, error } = await setSelected(
			supabase,
			e.course,
			id as string,
			infoCourse.id
		);
		setChanging(false);
		if (error) {
			toast.error("Error selecting course");
			return;
		}
	};

	const handleClose = () => {
		setSideBar(SIDEBAR.NONE);
	};

	return (
		<div className="h-[calc(100vh-4rem)] absolute">
			<div
				className="h-full border-[0.1px] border-gray-300 absolute z-[9999] resize-x"
				// className="h-full border-[0.1px] border-cyan-300/70 absolute z-[9999] resize-x"
				// className="h-full border border-sky-300/50 absolute z-[9999] resize-x"
				style={{
					right: show ? "25vw" : "0",
					transition: "all 0.3s ease-in-out",
				}}
			></div>
			<div
				className={`bg-white h-[calc(100vh-4rem)] right-0 fixed z-50`}
				style={{
					width: "25vw",
					marginRight: show ? "0" : "-23.5vw",
					transition: "all 0.3s ease-in-out",
				}}
			>
				<div className="flex flex-col h-full text-black">
					<Tab.Group selectedIndex={index} onChange={setIndex}>
						<div className="flex flex-row justify-between items-center px-4 py-3 transition-colors shadow-md font-Raleway bg-green-pea">
							{/* <div className="flex flex-row justify-center items-center px-4 py-3 transition-colors shadow-md font-Poppins bg-cyan-800"> */}
							<Tab.List className="flex flex-row space-x-4">
								<Tab
									disabled={!selected}
									className={({ selected }) =>
										`text-md select-none h-full py-1 rounded px-3 font-Montserrat ${
											selected
												? "font-bold text-green-pea bg-white"
												: // ? "font-bold text-white bg-cyan-900"
												  "hover:bg-[#d1ffe3]  disabled:hover:text-green-pea/70 disabled:cursor-not-allowed disabled:opacity-100 hover:text-green-pea transition-colors font-bold text-white"
											// : "hover:bg-cyan-600/60 disabled:hover:bg-cyan-700 disabled:hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 hover:text-cyan-50 transition-colors font-bold text-cyan-100"
										}`
									}
								>
									Course Info
								</Tab>
								{infoCourse?.children && (
									<Tab
										className={({ selected }) =>
											`text-md select-none h-full py-1 rounded px-3 font-Montserrat ${
												selected
													? "font-bold text-green-pea bg-white"
													: "hover:bg-[#d1ffe3] disabled:hover:text-green-pea/70 disabled:cursor-not-allowed disabled:opacity-100 hover:text-green-pea transition-colors font-bold text-white"
												//   "font-bold text-green-pea bg-white"
												// : "hover:bg-cyan-600/60 hover:text-cyan-50 transition-colors font-bold text-cyan-100"
											}`
										}
									>
										Selection
									</Tab>
								)}
								{/* <Tab className={({ selected }) => `text-md select-none h-full py-2 rounded px-3 ${selected ? 'bg-white font-bold text-cyan-900' : 'hover:bg-cyan-600 hover:text-white transition-colors font-bold text-cyan-200'}`}>Corequisites</Tab> */}
							</Tab.List>
							<button
								onClick={handleClose}
								className=" inline-flex items-center justify-center rounded-md bg-dark-green p-2 text-gray-200 hover:bg-mid-green hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
							>
								<XMarkIcon />
							</button>
							{/* <div className="text-lg font-bold text-cyan-900">Course Info</div> */}
						</div>
						{/* HACK: forcibly making tailwind import the classes for the chips to work*/}
						<div className="bg-green-600 hidden"></div>
						<div className="bg-blue-600 hidden"></div>
						<div className="bg-red-600 hidden"></div>
						<div className="bg-purple-600 hidden"></div>
						<div className="flex-grow overflow-y-auto text-black">
							<div className="px-2 py-2 text-start">
								<Tab.Panels>
									{infoCourse.name || !infoCourse.children ? (
										<Tab.Panel>
											<div className="bg-thunder/95 rounded p-2">
												<div className="text-xl text-white font-bold font-Lato">
													{infoCourse.name}
												</div>
												<div className="text-sm font-bold text-white font-JetBrainsMono">
													{infoCourse.id}
												</div>
												<div className="flex flex-row space-x-2 mt-2">
													{Object.keys(level).indexOf(
														levelIndex
													) !== -1 ? (
														<div
															className={`text-xs font-bold text-white rounded px-2 py-1 bg${level[levelIndex].color}`}
														>
															{
																level[
																	levelIndex
																].label
															}
														</div>
													) : (
														<div className="text-xs font-bold text-white rounded px-2 py-1 bg-blue-600">
															Introductory
														</div>
													)}
													<div className="text-xs font-bold text- rounded px-2 py-1 text-slate-700 bg-slate-200">
														<span className="">
															{infoCourse.credits}
														</span>{" "}
														credits
													</div>
												</div>
											</div>

											<div className="mx-3 mt-3">
												<div className="indent-4 text-base font-Montserrat">
													{Object.keys(info).map(
														(key) => {
															if (
																key ===
																infoCourse.id
															) {
																return info[key]
																	.desc;
															}
														}
													)}
												</div>
											</div>
										</Tab.Panel>
									) : (
										<>
											<Tab.Panel>
												<div className="bg-thunder/95 rounded p-2">
													{/* <div className="bg-thunder border border-cyan-200 rounded p-2"> */}
													<div className="text-xl text-white font-bold font-Poppins">
														{selectedCourse.name}
													</div>
													<div className="text-sm font-bold text-white font-JetBrainsMono">
														{selectedCourse.course}
													</div>
													<div className="flex flex-row space-x-2 mt-2">
														{Object.keys(
															level
														).indexOf(
															levelIndex
														) !== -1 ? (
															<div
																className={`text-xs font-bold text-white rounded px-2 py-1 bg${level[levelIndex].color}`}
															>
																{
																	level[
																		levelIndex
																	].label
																}
															</div>
														) : (
															<div className="text-xs font-bold text-white rounded px-2 py-1 bg-blue-600">
																Introductory
															</div>
														)}
														<div className="text-xs font-bold text- rounded px-2 py-1 text-cyan-100 bg-cyan-600">
															<span className="">
																{
																	infoCourse.credits
																}
															</span>{" "}
															credits
														</div>
													</div>
												</div>
												<div className="mx-3 mt-2">
													<div className="indent-4 text-sm font-Poppins">
														{info[
															selectedCourse
																.course
														]
															? info[
																	selectedCourse
																		.course
															  ].desc
															: "No description"}
													</div>
												</div>
											</Tab.Panel>
											<Tab.Panel>
												<div className="bg-thunder/95 rounded p-2">
													<div className="text-xl text-white font-bold font-Poppins">
														{infoCourse.id}
													</div>
													<div className="text-sm font-bold text-white font-JetBrainsMono">
														{selectedCourse.name !==
														""
															? selectedCourse.name
															: "Select course"}
													</div>
												</div>
												{/* radio group to choose a course from infoCourse.children */}
												<div className="mx-3 mt-2">
													{/* <i className="absolute mt-[0.8rem] ml-2">
														<Search
															width={18}
															height={18}
														/>
													</i>
													<input
														type="text"
														className="w-full rounded bg-white border mb-3 py-2 pl-10 shadow"
													></input> */}
													<RadioGroup
														value={selectedCourse}
														onChange={handleChange}
													>
														<div className="grid grid-cols-2 gap-4">
															{infoCourse.children.map(
																(child) => (
																	<RadioGroup.Option
																		key={
																			child.course
																		}
																		value={
																			child
																		}
																		className={({
																			active,
																			checked,
																		}) =>
																			`${
																				active
																					? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
																					: ""
																			}
                                                                        ${
																			checked
																				? "bg-opacity-75"
																				: ""
																		}
                                                                            relative flex cursor-pointer transition-all rounded px-3 py-2 shadow-md focus:outline-none border border-black`
																		}
																		style={{
																			backgroundColor:
																				child.selected
																					? child.color
																					: "rgb(22 78 99)",
																			boxShadow: `-3px 5px ${
																				child.selected
																					? "#000"
																					: child.color
																			}`,
																			// color: child.selected ? '#fff' : child.color
																			color: "#fff",
																			borderColor:
																				child.selected
																					? "#000"
																					: "rgb(22 78 99)",
																		}}
																	>
																		{({
																			active,
																			checked,
																		}) => (
																			<>
																				<div className="flex w-full items-center justify-center">
																					<div
																						className="flex items-center rounded p-2 font-JetBrainsMono"
																						style={
																							child.selected
																								? {
																										background:
																											"#000",
																								  }
																								: {}
																						}
																					>
																						<div className="text-lg">
																							<RadioGroup.Label
																								as="p"
																								className={`font-medium  ${
																									""
																									// checked ? 'text-cyan-900' : 'text-white'
																								}`}
																								style={{
																									color: checked
																										? "#fff"
																										: child.color,
																								}}
																							>
																								{
																									child.course
																								}
																							</RadioGroup.Label>
																							{/* <RadioGroup.Description
                                                                                        as="span"
                                                                                        className={`inline font-Lato text-sm ${
                                                                                        checked ? 'text-sky-100' : 'text-cyan-200'
                                                                                        }`}
                                                                                    >
                                                                                        <span>
                                                                                        {child.name}
                                                                                        </span>
                                                                                        {/* {' '} * /}
                                                                                        <span aria-hidden="true">&middot;</span>{' '}
                                                                                        {/* <span>{plan.disk}</span> * /}
                                                                                    </RadioGroup.Description> */}
																						</div>
																					</div>
																					{checked && (
																						<div className="shrink-0 text-white absolute z-20 top-0 right-0 translate-x-1/2 -translate-y-1/2">
																							<CheckIcon className="h-6 w-6 bg-cyan-900 rounded-full" />
																						</div>
																					)}
																				</div>
																			</>
																		)}
																	</RadioGroup.Option>
																)
															)}
														</div>
													</RadioGroup>
												</div>
											</Tab.Panel>
										</>
									)}
								</Tab.Panels>
							</div>
						</div>
					</Tab.Group>
					{/* <div className="flex flex-row items-center w-full p-1">
                        <div className="text-md select-none h-full py-2 text-center rounded w-full px-3 hover:bg-red-100 transition-colors font-bold text-red-600 cursor-pointer font-Poppins" onClick={() => setSideBar(SIDEBAR.NONE)}>Close</div>
                    </div> */}
					<div className="group h-fit w-screen">
						<div
							className="w-[25vw] h-[calc(100vh-4rem)] bg-white z-[99999] absolute peer cursor-pointer"
							style={{
								display: !true ? "block" : "none",
								marginLeft: show ? "0" : "-23.5vw",
							}}
							onClick={() => {}}
						></div>
						<div
							className={`z-[9999] group-hover:bg-cyan-500 peer-hover:bg-cyan-500 top-1/2 absolute translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-xl bg-white cursor-pointer `}
							style={{
								left: show ? "75vw" : "98.5vw",
								transition:
									"all 0.3s ease-in-out, background-color 0.1s ease-in-out, fill 0.1s ease-in-out",
								// backgroundColor: !hovering ? 'white' : '#0e7490',
								// filter: !hovering ? 'brightness(100%)' : 'brightness(110%)',
								// boxShadow: '-3px 5px #000',
							}}
							// onClick={handleClose}
							// onMouseEnter={() => setHovering(true)}
							// onMouseLeave={() => setHovering(false)}
						>
							<svg
								className="group-hover:fill-white peer-hover:fill-white fill-black"
								fill={!true ? "black" : "white"}
								// onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
								style={{
									transform: show
										? "rotate(180deg)"
										: "rotate(0deg)",
									transition: "all 0.1s ease-in-out",
								}}
								xmlns="http://www.w3.org/2000/svg"
								enableBackground="new 0 0 64 64"
								viewBox="0 0 64 64"
							>
								<path
									className={
										"cursor-pointer group-hover:fill-current group-hover:text-white peer-hover:fill-current peer-hover:text-white"
									}
									// style={{fill: hovering ? '#ffffff' : '#000000', transition: 'all 0.3s ease-in-out, fill 0.2s ease-in-out'}}
									d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
									transform="translate(237 335)"
									// onMouseEnter={() => setHovering(true)}
									// onMouseLeave={() => setHovering(false)}
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightBar;
