#include <cstdio>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long somme = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        somme = somme + x;
    }
    double moyenne = (double) somme / n;   // division décimale
    printf("%.2f\n", moyenne);
    return 0;
}
