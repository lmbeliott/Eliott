#include <iostream>
#include <string>
using namespace std;

int main() {
    int k;
    string d;
    cin >> k >> d;
    int n = d.size();

    long long total = 0;
    for (int j = 0; j < n; j++) {
        int c = d[j] - '0';
        if (c % k == 0) {                                // morceau d'un chiffre
            total += 1;
        }
        if (j >= 1) {
            int b = d[j - 1] - '0';
            if ((10 * b + c) % k == 0) {                 // morceau de deux chiffres
                total += 1;
            }
            if (j >= 2) {
                int a = d[j - 2] - '0';
                if ((100 * a + 10 * b + c) % k == 0) {   // les j - 1 morceaux plus longs
                    total += j - 1;
                }
            }
        }
    }
    cout << total << "\n";
    return 0;
}
