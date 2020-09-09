//
//  Counter.swift
//  MapsApp
//
//  Created by Ishan Sengupta on 8/26/20.
//

import Foundation
import NaturalLanguage



@available(iOS 13.0, *)
@objc(Counter)
class Counter: RCTEventEmitter {
  
  private var count = 0
  private let string1 = """
  Hello world, I love machine learning and I work as a Data Scientist in India.
  機械学習で働くのが好き
  """
  
  private let languageRecog = NLLanguageRecognizer()
  
  private let tagger = NLTagger(tagSchemes: [.sentimentScore])
  
  @objc
  func analyzeSentiment(_ name: String) {
    tagger.string = name
    
    let sentiment = tagger.tag(at: name.startIndex, unit: .paragraph, scheme: .sentimentScore).0
    
    let score = Double(sentiment?.rawValue ?? "0") ?? 0
    
    sendEvent(withName: "onSentAnalyze", body: ["score": score])
  }
  
  
  
  
  
  @objc
  func tokenizeText() {
  languageRecog.processString(string1)
  
  print("Dominant language is: \(languageRecog.dominantLanguage?.rawValue)")
    
  sendEvent(withName: "onTokenize", body: ["language": languageRecog.dominantLanguage?.rawValue] )
  
  }

  @objc
  func increment() {
    count += 1
    print("count is \(count)")
    
    // send our event with some data
    // body can be anything: int, string, array, object
    sendEvent(withName: "onIncrement", body: ["count": count])
  }
  
  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
    callback([count])
  }
  
  @objc
  func decrement(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    if (count == 0) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("E_COUNT", "count cannot be negative", error)
    } else {
      count -= 1
      resolve("count was decremented")
    }
  }
  
  // we need to override this method and
  // return an array of event names that we can listen to
  override func supportedEvents() -> [String]! {
    return ["onIncrement", "onTokenize", "onSentAnalyze"]
  }
  
  override func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": count]
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

}
