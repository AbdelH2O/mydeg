import { Node } from 'reactflow';

type NodeData = {
  code: 'CSC 1401',
  name: 'name of node 1',
  background: '#bae6fd',
};

type CustomNode = Node<NodeData>;

interface Degree_Term {
  id: string /* primary key */;
  name: any; // type unknown;
  created_at: string;
}

interface Professor {
  name: string /* primary key */;
  school: string;
  rating: number;
  keywords: any[];
}

interface Majors {
  name: string /* primary key */;
  catalog: string; // type unknown;
  type: string; // type unknown;
}

interface Single_Term {
  id: string /* primary key */;
  major: string /* foreign key to Majors.name */;
  minor?: string /* foreign key to Majors.name */;
  created_at?: string;
  Majors?: Majors;
  Majors?: Majors;
}

interface Course {
  code: string /* primary key */;
  name: string;
  credits: number;
  prerequisites_misc: string[];
}

interface Major_Course {
  id: number /* primary key */;
  major: string /* foreign key to Majors.name */;
  course: string /* foreign key to Course.code */;
  group: number;
  parent?: string;
  color: string;
  Majors?: Majors;
  Course?: Course;
  x: number;
  y: number;
}

interface Section {
  id: string /* primary key */;
  professor: string /* foreign key to Professor.name */;
  course: string /* foreign key to Course.code */;
  days: string;
  start_time: string;
  end_time: string;
  term: string;
  Professor?: Professor;
  Course?: Course;
}

interface Degree_Term_Course {
  id: number /* primary key */;
  term: string /* foreign key to Degree_Term.id */;
  course: string /* foreign key to Course.code */;
  Degree_Term?: Degree_Term;
  Course?: Course;
}

interface Degree {
  id: string /* primary key */;
  major: string /* foreign key to Majors.name */;
  minor: string /* foreign key to Majors.name */;
  created_at?: string;
  Majors?: Majors;
  Majors?: Majors;
}

interface Single_Term_Section {
  id: number /* primary key */;
  term: string /* foreign key to Single_Term.id */;
  section: string /* foreign key to Section.id */;
  Single_Term?: Single_Term;
  Section?: Section;
}

interface Course_Course {
  id: number /* primary key */;
  course: string /* foreign key to Course.code */;
  requisite: string /* foreign key to Course.code */;
  type: string;
  group: number;
  Course?: Course;
  Course?: Course;
}

interface Degree_Degree_Term {
  id: number /* primary key */;
  degree: string /* foreign key to Degree.id */;
  term: string /* foreign key to Degree_Term.id */;
  Degree?: Degree;
  Degree_Term?: Degree_Term;
}
