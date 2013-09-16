(ns karma-golf.models.utils
  (:require [clojure.data.json :as json]
            )
   )
  


;(def comment-maps (atom []))
(defn key-tree
  "Display the keys of a nested map cleanly."
  ([map] (key-tree map 0))
  ([map indent]
      (if (map? map)
        (doseq [ k (keys map)]
          (println (str (apply str (repeat indent " ")) k))
          (key-tree (k map) (+ indent 4))
          )
        (if (or (list? map) (vector? map))
          (key-tree (first map) (+ indent 4))
          )
        )))

(defn from-reddit [path arguments]
  (json/read-json
   (slurp
    (str "http://api.reddit.com" path ".json" arguments)
    )))


(defn comment-links [listing-map]
  (map #(-> % :data) (:children (:data listing-map)))
  )

(defn comments-list
  [the-map]
  (if  (:data the-map)
    (comments-list  (:data the-map) )   
    {
     :body-html (:body the-map)
     :ups (:ups the-map)
     :downs (:downs the-map)
     :replies (vec (map #(comments-list (:data %)) (:children (:data (:replies the-map)))))
  ;   :orig-replies (:replies the-map)
     })
  )

(defn clean-comments [comments]
  (assoc comments :comments (map comments-list (-> comments :comments second :data :children)))
  )

;code snippets from the repl 


(defn comment-maps [subreddit]
  (let [ mapz (atom [])
        linx (comment-links (from-reddit (str "/r/" subreddit "/top/") "?t=month"))]
    (doseq [link linx]
         (swap! mapz conj (assoc link :comments (from-reddit (:permalink link) "")))
         (println "Downloaded  " (:permalink link) " " (:score link) " upvotes")
         )
       @mapz
       )
  )
