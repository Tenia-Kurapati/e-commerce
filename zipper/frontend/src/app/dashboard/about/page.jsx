'use client';

import { Shield, Truck, RotateCcw, Heart, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About ProShop Zipper</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the finest products with exceptional quality, 
            innovative design, and outstanding customer service.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-12">
              To provide our customers with carefully curated products that enhance their daily lives, 
              while maintaining the highest standards of quality, sustainability, and customer satisfaction. 
              We believe that great products should be accessible to everyone.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Passion</h3>
                <p className="text-slate-600">We're passionate about quality and innovation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Excellence</h3>
                <p className="text-slate-600">We strive for excellence in everything we do</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Community</h3>
                <p className="text-slate-600">Building lasting relationships with our customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Our Values</h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Quality First</h3>
                    <p className="text-slate-600">
                      Every product in our collection is carefully selected for its quality, 
                      durability, and design excellence.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-emerald-600">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Customer Focus</h3>
                    <p className="text-slate-600">
                      Our customers are at the heart of everything we do. We listen, learn, 
                      and continuously improve based on your feedback.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-amber-600">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Innovation</h3>
                    <p className="text-slate-600">
                      We embrace new technologies and innovative solutions to provide 
                      the best possible shopping experience.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-600">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Sustainability</h3>
                    <p className="text-slate-600">
                      We're committed to environmental responsibility and work with 
                      partners who share our sustainability values.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-red-600">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Transparency</h3>
                    <p className="text-slate-600">
                      We believe in honest communication and transparent business practices 
                      with our customers and partners.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">6</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Integrity</h3>
                    <p className="text-slate-600">
                      We conduct business with the highest ethical standards and 
                      maintain the trust of our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why Choose ProShop Zipper?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Free Shipping</h3>
              <p className="text-slate-600 text-sm">Complimentary shipping on orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Returns</h3>
              <p className="text-slate-600 text-sm">30-day hassle-free returns with fast refunds</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-slate-600 text-sm">Protected checkout with industry-standard security</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Quality Guarantee</h3>
              <p className="text-slate-600 text-sm">Every product meets our high quality standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ProShop Zipper for their shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/products">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100">
                Shop Now
              </Button>
            </Link>
            <Link href="/dashboard/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
