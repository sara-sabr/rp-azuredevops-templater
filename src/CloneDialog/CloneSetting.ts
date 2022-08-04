export class CloneSettings {
  copyHierarchy:boolean = true;
  replaceText:boolean = false;
  unassignAll:boolean = true;
  replacements:Map<string,string> = new Map();
}