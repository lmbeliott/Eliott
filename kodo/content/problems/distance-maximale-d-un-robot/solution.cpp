#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long x = 0, y = 0;
    long long plus_loin = 0;
    for (int i = 0; i < n; i++) {
        string d;
        long long k;
        cin >> d >> k;
        if (d == "N") {
            y = y + k;
        } else if (d == "S") {
            y = y - k;
        } else if (d == "E") {
            x = x + k;
        } else {
            x = x - k;
        }
        // distance |x| + |y|, calculée sans fonction
        long long ax = x;
        if (ax < 0) {
            ax = -ax;
        }
        long long ay = y;
        if (ay < 0) {
            ay = -ay;
        }
        if (ax + ay > plus_loin) {
            plus_loin = ax + ay;
        }
    }
    cout << x << " " << y << " " << plus_loin << "\n";
    return 0;
}
