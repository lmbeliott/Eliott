#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int q = 0; q < t; q++) {
        long long c[3];
        cin >> c[0] >> c[1] >> c[2];
        long long reponse = -1;
        // couleur d'arrivée k : il faut vider les deux autres, de même reste modulo 3
        for (int k = 0; k < 3; k++) {
            long long x = c[(k + 1) % 3], y = c[(k + 2) % 3];
            if (x % 3 == y % 3) {
                if (reponse == -1 || max(x, y) < reponse) {
                    reponse = max(x, y);
                }
            }
        }
        cout << reponse << "\n";
    }
    return 0;
}
