import classnames from "classnames";
import { v4 as uuidv4 } from "uuid";
declare global {
  var cx: typeof classnames;
  var css: typeof css;
  var uuid: typeof uuidv4;
  var userRole: any;
  var navigate: (url: string) => void;
  var router: useRouter;
  var headerTitle: string;
  var breadcrumbTitle: any;
  var events: (mode: string, data: any) => Promise<any> | any;
}
declare var siteurl: (path: string) => string;
