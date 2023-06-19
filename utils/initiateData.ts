import { SupabaseClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { env } from "./env";

type Course = {
	corequisites: string[];
	course_code: string;
	course_name: string;
	credits: string;
	prerequisites: {
		type: string;
		value: string;
	}[][];
	sections: {
		instructor: string;
		schedule: string;
	}[];
};
global.crypto = require("crypto");

function uuidv4() {
	// @ts-ignore
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
}

// create a new supabase client
const supabase = new SupabaseClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_ANON
);

// read the json file jz_scraper_final.json and parse it
const data: Course[] = JSON.parse(
	fs.readFileSync("jz_scraper_final.json", "utf8")
);
// const professors: Set<string> = new Set();
// const parseSchedule = (schedule: string) => {

(async () => {
	for (const course of data) {
		// console.log(course.prerequisites.filter(prerequisite => prerequisite.type === "course"));

		let group = 0;
		for (const prerequisite of course.prerequisites) {
			for (const crs of prerequisite.filter(
				(prerequisite) => prerequisite.type === "course"
			)) {
				// console.log(crs.value, course.course_code);

				const { data, error } = await supabase
					.from("Course_Course")
					.insert([
						{
							course: course.course_code,
							requisite:
								crs.value.slice(0, 3) +
								" " +
								crs.value.slice(3),
							group,
							type: "pre",
						},
					]);
				console.log(data, error);
			}
			group++;
		}
		// for(const section of course.sections) {
		//     const { data, error } = await supabase
		//         .from("Section")
		//         .insert([
		//             {
		//                 id: uuidv4(),
		//                 course: course.course_code,
		//                 professor: section.instructor ? section.instructor : "TBA",
		//                 raw_schedule: section.schedule
		//             }
		//         ]);
		//     console.log(data, error);
		// }

		// course.sections.forEach((section) => professors.add(section.instructor));
	}

	// console.log(professors);

	// professors.forEach(async (professor) => {
	//     const { data, error } = await supabase
	//         .from("Professor")
	//         .insert([
	//             {
	//                 name: professor,
	//                 rating: 0,
	//                 keywords: [],
	//             }
	//         ]);
	//     console.log(data, error);
	// });
})();
