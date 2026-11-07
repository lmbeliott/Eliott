#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b;
        cin >> a >> b;
        long long carres = 0;
        while (b != 0) {
            // on découpe a / b carrés de côté b, il reste une feuille b × (a % b)
            carres += a / b;
            long long r = a % b;
            a = b;
            b = r;
        }
        cout << carres << " " << a << "\n";
    }
    return 0;
}
