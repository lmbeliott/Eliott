#include <iostream>
#include <set>
using namespace std;

long long etape(long long x, int d) {
    // compte les chiffres de x écrit avec exactement d chiffres (zéros devant compris)
    int nb[10] = {0};
    for (int i = 0; i < d; i++) {
        nb[x % 10]++;
        x = x / 10;
    }
    long long grand = 0;
    for (int c = 9; c >= 0; c--) {      // chiffres dans l'ordre décroissant
        for (int k = 0; k < nb[c]; k++) {
            grand = grand * 10 + c;
        }
    }
    long long petit = 0;
    for (int c = 0; c <= 9; c++) {      // chiffres dans l'ordre croissant
        for (int k = 0; k < nb[c]; k++) {
            petit = petit * 10 + c;
        }
    }
    return grand - petit;
}

int main() {
    int d;
    long long x;
    cin >> d >> x;
    set<long long> vus;
    while (vus.count(x) == 0) {
        vus.insert(x);
        x = etape(x, d);
    }
    cout << vus.size() << "\n";
    return 0;
}
