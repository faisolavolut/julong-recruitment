import classnames from "classnames";
import { css } from "@emotion/css";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
declare global {
  var cx: typeof classnames;
  var css: typeof css;
  var uuid: typeof uuidv4;
  var navigate: (url: string) => void;
  var router: useRouter
}
declare var siteurl: (path: string) => string;
