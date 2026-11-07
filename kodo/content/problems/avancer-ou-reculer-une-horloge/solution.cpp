#include <iostream>
using namespace std;

int main() {
    long long h, m, d;
    cin >> h >> m >> d;
    long long t = 60 * h + m + d;          // minutes depuis 0 h 00, peut être négatif
    t = ((t % 1440) + 1440) % 1440;        // reste ramené entre 0 et 1439
    cout << t / 60 << " " << t % 60 << "\n";
    return 0;
}
