#include <iostream>
using namespace std;

int main() {
    int a, b, c, t;
    cin >> a >> b >> c;
    // Trois échanges suffisent pour ranger trois nombres.
    if (a > b) {
        t = a;
        a = b;
        b = t;
    }
    if (b > c) {
        t = b;
        b = c;
        c = t;
    }
    // c contient maintenant le plus grand ; on range a et b.
    if (a > b) {
        t = a;
        a = b;
        b = t;
    }
    cout << a << " " << b << " " << c << "\n";
    return 0;
}
