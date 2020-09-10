//
//  LangParser.swift
//  MapsApp
//
//  Created by Ishan Sengupta on 9/9/20.
//

import Foundation
import NaturalLanguage



@available(iOS 13.0, *)
@objc(LangParser)
class LangParser: NSObject {
  
  private let languageRecog = NLLanguageRecognizer()
  

  
 let tagger = NLTagger(tagSchemes: [.sentimentScore])
  
 @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": 0]
  }
  
  private var count = 0
  @objc
  func increment() {
    count += 1
    print("count is \(count)")
  }
  
  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
    callback([count])
  }
  
  @objc func callbackMethod(_ callback: RCTResponseSenderBlock) -> Void {
    let resultsDict = [
      "success" : true
    ];
     
    callback([NSNull() ,resultsDict])
  }
   
  @objc func simpleMethod(_ message: String!) {
    print("\(message)")
  }
  
  @objc
   func login(_ email: String, password: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
     resolve("You sent: email '\(email)', password '\(password)'")
   }
  
 
  
  @objc
   func getSentiment(_ text: String,  resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
     let tagger = NLTagger(tagSchemes: [.sentimentScore])
    tagger.string = text
    
let (sentiment, _) = tagger.tag(at: text.startIndex, unit: .paragraph, scheme: .sentimentScore)
    
  let score = Double(sentiment?.rawValue ?? "0") ?? 0
    
     resolve(score)
   }
  
 @objc
 static func requiresMainQueueSetup() -> Bool {
   return true
 }
  
  

}
