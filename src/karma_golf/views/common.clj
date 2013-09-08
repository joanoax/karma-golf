(ns karma-golf.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page :only [include-css include-js  html5]]))

(defpartial angular[& content]
  [:html
   content
   ]
  )

(defpartial layout [& content]
            (angular
              [:head
               [:title "K A R M A   G A R D E N"]
               (include-css "/css/reset.css")
               (include-css "/css/bootstrap.css")
               (include-css "/css/main.css")
               (include-js "/js/underscore-min.js")
               (include-js "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js")
               (include-js "/js/piece.js")
               (include-js "/js/key.js")
               (include-js "/js/set.js")
               (include-js "/js/main.js")
               ]
              [:body
               [:div#content.row
                content]]))

