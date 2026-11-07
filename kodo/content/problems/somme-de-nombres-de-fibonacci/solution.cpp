#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> fib = {1, 2};
    while (fib[fib.size() - 1] + fib[fib.size() - 2] <= 1000000000000000000LL) {
        fib.push_back(fib[fib.size() - 1] + fib[fib.size() - 2]);
    }
    int t;
    cin >> t;
    for (int q = 0; q < t; q++) {
        long long n;
        cin >> n;
        int nb = 0;
        int i = fib.size() - 1;
        while (n > 0) {
            while (fib[i] > n) {      // plus grand nombre de Fibonacci au plus n
                i--;
            }
            n -= fib[i];
            nb++;
        }
        cout << nb << "\n";
    }
    return 0;
}
