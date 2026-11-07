#include <iostream>
using namespace std;

int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    // arrondi inférieur de b / k : on corrige la troncature vers zéro du C++
    long long qb = b / k;
    if (b % k < 0) {
        qb = qb - 1;
    }
    // arrondi inférieur de (a - 1) / k
    long long x = a - 1;
    long long qa = x / k;
    if (x % k < 0) {
        qa = qa - 1;
    }
    cout << qb - qa << "\n";
    return 0;
}
