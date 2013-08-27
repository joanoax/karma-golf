(ns karma-golf.server
  (:require [noir.server :as server]
            [karma-golf.models.db :as db]))

(server/load-views-ns 'karma-golf.views)

(defn -main [& m]
  (let [mode (keyword (or (first m) :dev))
        port (Integer. (get (System/getenv) "PORT" "8080"))]
    (db/jack-in!)
    (server/start port {:mode mode
                        :ns 'server})))

